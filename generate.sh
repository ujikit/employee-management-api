#!/bin/bash

set -e

echo "🚀 Updating nominal calculation formula in attendance.service.ts..."

BASE_DIR="src/applications/v1/shared/attendance"

cat << 'EOF' > "$BASE_DIR/service/attendance.service.ts"
import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/commons/v1/database/database.service';
import { JwtDto } from 'src/commons/v1/dtos/unique-jwt-owner.dto';
import { CreateAttendanceItemDto } from '../dtos/create-attendance.dto';
import { RecalculationResult } from '../interfaces/allowance-recalculation.interface';

@Injectable()
export class AttendanceService {
  constructor(private readonly dataBaseService: DatabaseService) {}

  async getAttendance(req: JwtDto) {
    const now = new Date();
    const startOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfPrevMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

    const data = await this.dataBaseService.attendance.findMany({
      where: {
        attendance_date: {
          gte: startOfPrevMonth,
          lte: endOfPrevMonth,
        },
      },
      include: {
        employee: true,
      },
    });

    if (!data) {
      throw new BadRequestException('translation.VALIDATION.NOT_FOUND_INTERNAL');
    }

    return { data };
  }

  async createAttendance(req: JwtDto, items: CreateAttendanceItemDto[]) {
    if (!items || items.length === 0) {
      throw new BadRequestException('translation.VALIDATION.EMPTY_PAYLOAD');
    }

    const firstItemDate = new Date(items[0].attendance_date);
    const periodYear = firstItemDate.getFullYear();
    const periodMonth = firstItemDate.getMonth() + 1;
    const userId = (req.user as any)?.id || (req as any)?.id || 1;

    const result = await this.dataBaseService.$transaction(async (tx) => {
      // Step 1: Create attendance_imports entry
      const importRecord = await tx.attendanceImport.create({
        data: {
          user_id: userId,
          original_filename: `manual_import_${periodYear}_${periodMonth}.json`,
          period_year: periodYear,
          period_month: periodMonth,
          status: 'COMPLETED',
          total_rows: items.length,
          processed_rows: items.length,
          started_at: new Date(),
          finished_at: new Date(),
        },
      });

      // Step 2: Insert attendances batch
      const records = items.map((item) => ({
        employee_id: item.employee_id,
        attendance_import_id: importRecord.id,
        attendance_date: new Date(item.attendance_date),
        checkin_at: item.checkin_at ? new Date(item.checkin_at) : null,
        checkout_at: item.checkout_at ? new Date(item.checkout_at) : null,
        checkin_location: item.checkin_location ?? null,
        checkout_location: item.checkout_location ?? null,
        attendance_type: item.attendance_type,
        duration_hours: item.duration_hours ?? null,
        status: item.status,
        verification_status: item.verification_status ?? null,
        verified_by_role: item.verified_by_role ?? null,
        remarks: item.remarks ?? null,
      }));

      const insertedAttendances = await tx.attendance.createMany({
        data: records,
      });

      // Step 3: Trigger transport_allowance_details recalculation
      const recalculation = await this.recalculateTransportAllowance(tx, periodYear, periodMonth);

      return {
        attendance_import_id: importRecord.id,
        attendance_inserted: insertedAttendances.count,
        allowance_recalculation: recalculation,
      };
    });

    return { data: result };
  }

  private async recalculateTransportAllowance(
    tx: Prisma.TransactionClient,
    year: number,
    month: number
  ): Promise<RecalculationResult | null> {
    const settings = await tx.transportAllowanceSetting.findFirst({
      where: { is_active: true },
    });

    if (!settings) return null;

    let period = await tx.transportAllowancePeriod.findFirst({
      where: { period_year: year, period_month: month },
    });

    if (!period) {
      period = await tx.transportAllowancePeriod.create({
        data: {
          period_year: year,
          period_month: month,
          status: 'CALCULATED',
          total_recipients: 0,
          total_amount: 0,
        },
      });
    }

    const startOfMonth = new Date(year, month - 1, 1);
    const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);

    const attendanceSummary = await tx.attendance.groupBy({
      by: ['employee_id'],
      where: {
        attendance_date: { gte: startOfMonth, lte: endOfMonth },
        status: 'TERPENUHI',
        attendance_type: 'HADIR',
      },
      _count: {
        id: true,
      },
    });

    let totalRecipients = 0;
    let totalAmount = 0;

    for (const summary of attendanceSummary) {
      const employee = await tx.employee.findUnique({
        where: { id: summary.employee_id },
      });

      if (!employee) continue;

      const attendanceDays = summary._count.id;
      const originalKm = employee.distance_km ?? 0;
      const roundedKm = Math.round(originalKm);

      const isEligibleType = employee.employment_type === 'PKWTT';
      const meetsMinAttendance = attendanceDays >= 19;
      const meetsMinDistance = roundedKm >= settings.min_km;

      const isEligible = isEligibleType && meetsMinAttendance && meetsMinDistance;
      const billableKm = Math.min(roundedKm, settings.max_km);

      // ALWAYS calculate nominal regardless of eligibility
      const nominal = billableKm * settings.base_fare * attendanceDays;

      if (isEligible) {
        totalRecipients += 1;
        totalAmount += nominal;
      }

      await tx.transportAllowanceDetail.upsert({
        where: {
          period_id_employee_id: {
            period_id: period.id,
            employee_id: employee.id,
          },
        },
        update: {
          base_fare: settings.base_fare,
          original_km: originalKm,
          rounded_km: roundedKm,
          attendance_days: attendanceDays,
          nominal: nominal,
          eligibility_status: isEligible ? 'ELIGIBLE' : 'INELIGIBLE',
        },
        create: {
          period_id: period.id,
          employee_id: employee.id,
          base_fare: settings.base_fare,
          original_km: originalKm,
          rounded_km: roundedKm,
          attendance_days: attendanceDays,
          nominal: nominal,
          eligibility_status: isEligible ? 'ELIGIBLE' : 'INELIGIBLE',
        },
      });
    }

    const updatedPeriod = await tx.transportAllowancePeriod.update({
      where: { id: period.id },
      data: {
        total_recipients: totalRecipients,
        total_amount: totalAmount,
        status: 'CALCULATED',
      },
    });

    return {
      period_year: updatedPeriod.period_year,
      period_month: updatedPeriod.period_month,
      total_recipients: updatedPeriod.total_recipients,
      total_amount: updatedPeriod.total_amount,
      status: updatedPeriod.status,
    };
  }
}
EOF

echo "✅ Success! Nominal is now always calculated as billableKm * settings.base_fare * attendanceDays."