import { BadRequestException, Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../../../commons/v1/database/database.service';
import { JwtDto } from '../../../../../commons/v1/dtos/unique-jwt-owner.dto';
import { CreateEmployeeDto } from '../dtos/create-employee.dto';
import { GetEmployeeQueryDto } from '../dtos/employee.dto';

@Injectable()
export class EmployeeService {
  constructor(private readonly dataBaseService: DatabaseService) { }

  async getEmployee(query: GetEmployeeQueryDto, req: JwtDto) {
    const page = Number(query?.page) || 1;
    const limit = Number(query?.limit) || 10;
    const skip = (page - 1) * limit;

    const sortBy = query?.sort_by || 'id';
    const sortOrder = query?.sort_order || 'asc';

    const orderBy: Record<string, 'asc' | 'desc'> = {
      [sortBy]: sortOrder,
    };

    const [data, total] = await Promise.all([
      this.dataBaseService.employee.findMany({
        skip,
        take: limit,
        orderBy,
        include: {
          position: true
        },
      }),
      this.dataBaseService.employee.count(),
    ]);

    if (!data) {
      throw new BadRequestException('translation.VALIDATION.NOT_FOUND_INTERNAL');
    }

    return {
      data,
      meta: {
        page,
        limit,
        total,
        total_pages: Math.ceil(total / limit),
        sort_by: sortBy,
        sort_order: sortOrder,
      },
    };
  }

  async getEmploymentStats(req: JwtDto) {
    const stats = await this.dataBaseService.employee.groupBy({
      by: ['employment_type'],
      _count: {
        id: true,
      },
    });

    const result = {
      total: 0,
      kontrak: 0,
      tetap: 0,
    };

    stats.forEach((item) => {
      if (item.employment_type === 'PKWT') {
        result.kontrak = item._count.id;
      } else if (item.employment_type === 'PKWTT') {
        result.tetap = item._count.id;
      }
      result.total += item._count.id;
    });

    return {
      data: result,
    };
  }

  async createEmployee(req: JwtDto, body: CreateEmployeeDto) {
    const existingNip = await this.dataBaseService.employee.findUnique({
      where: { nip: body.nip },
    });

    if (existingNip) {
      throw new BadRequestException('translation.VALIDATION.NIP_ALREADY_EXISTS');
    }

    const existingEmail = await this.dataBaseService.employee.findUnique({
      where: { email: body.email },
    });

    if (existingEmail) {
      throw new BadRequestException('translation.VALIDATION.EMAIL_ALREADY_EXISTS');
    }

    const { educations, birth_date, joined_at, ...employeeData } = body;

    const result = await this.dataBaseService.$transaction(async (tx) => {
      const employee = await tx.employee.create({
        data: {
          ...employeeData,
          birth_date: new Date(birth_date),
          joined_at: new Date(joined_at),
          created_by: req.user.id,
        },
      });

      if (educations && educations.length > 0) {
        await tx.employeeEducation.createMany({
          data: educations.map((edu, index) => ({
            employee_id: employee.id,
            education_level: edu.education_level,
            school_name: edu.school_name,
            graduation_year: edu.graduation_year,
            sort_order: index + 1,
          })),
        });
      }

      return tx.employee.findUnique({
        where: { id: employee.id },
        include: {
          employee_educations: true,
          position: true,
          department: true,
          district: {
            include: {
              regency: {
                include: {
                  province: true,
                },
              },
            },
          },
        },
      });
    });

    return {
      data: result,
    };
  }
}
