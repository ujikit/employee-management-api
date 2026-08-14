import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from '../../../../../commons/v1/database/database.service';
import { JwtDto } from '../../../../../commons/v1/dtos/unique-jwt-owner.dto';
import { CreateAttendanceItemDto } from '../dtos/create-attendance.dto';
import { RecalculationResult } from '../interfaces/allowance-recalculation.interface';

@Injectable()
export class AttendanceService {
  constructor(private readonly dataBaseService: DatabaseService) { }

  // 1. Fetch ALL recorded attendance data
  async getAttendance(req: JwtDto) {
    const data = await this.dataBaseService.attendance.findMany({
      include: {
        employee: true,
      },
      orderBy: {
        attendance_date: 'desc',
      },
    });

    if (!data) {
      throw new BadRequestException('translation.VALIDATION.NOT_FOUND_INTERNAL');
    }

    return { data };
  }

  // 2. Create Attendance Batch and Trigger Recalculation
  async createAttendance(req: JwtDto, items: CreateAttendanceItemDto[]) {
    if (!items || items.length === 0) {
      throw new BadRequestException('translation.VALIDATION.EMPTY_PAYLOAD');
    }

    const firstItemDate = new Date(items[0].attendance_date);
    const primaryYear = firstItemDate.getFullYear();
    const primaryMonth = firstItemDate.getMonth() + 1;
    const userId = (req.user as any)?.id || (req as any)?.id || 1;

    // Collect all unique Year-Month combinations in payload
    const periodMap = new Map<string, { year: number; month: number }>();
    items.forEach((item) => {
      const d = new Date(item.attendance_date);
      const y = d.getFullYear();
      const m = d.getMonth() + 1;
      const key = `${y}-${m}`;
      if (!periodMap.has(key)) {
        periodMap.set(key, { year: y, month: m });
      }
    });

    const result = await this.dataBaseService.$transaction(async (tx) => {
      // Step 1: Create attendance_imports record
      const importRecord = await tx.attendanceImport.create({
        data: {
          user_id: userId,
          original_filename: `manual_import_${primaryYear}_${primaryMonth}.json`,
          period_year: primaryYear,
          period_month: primaryMonth,
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
        data: records as any,
      });

      // Step 3: Trigger transport allowance recalculation for all affected periods
      const recalculations: RecalculationResult[] = [];
      for (const period of periodMap.values()) {
        const recalcResult = await this.recalculateTransportAllowance(tx, period.year, period.month);
        if (recalcResult) {
          recalculations.push(recalcResult);
        }
      }

      return {
        attendance_import_id: importRecord.id,
        attendance_inserted: insertedAttendances.count,
        allowance_recalculations: recalculations,
      };
    });

    return { data: result };
  }

  // 3. Recalculates transport_allowance_details & transport_allowance_periods based on strict business rules
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

    // Group records by employee where status = 'TERPENUHI' and attendance_type = 'HADIR'
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
      const originalKm = Number(employee.distance_km ?? 0);

      // Rounding Rule: < 0.5 rounds down, >= 0.5 rounds up
      const roundedKm = Math.round(originalKm);

      // Business Rules Checks
      const isEligibleType = employee.employment_type === 'PKWTT';
      const meetsMinAttendance = attendanceDays >= 19;

      // Rule: > 5 km (5 km or less gets 0)
      const meetsMinDistance = roundedKm > Number(settings.min_km);

      const isEligible = isEligibleType && meetsMinAttendance && meetsMinDistance;

      // Distance capped at max_km (25 km)
      const billableKm = Math.min(roundedKm, Number(settings.max_km));

      // Nominal calculated ONLY if eligible, otherwise 0
      const nominal = isEligible ? billableKm * Number(settings.base_fare) * attendanceDays : 0;

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
