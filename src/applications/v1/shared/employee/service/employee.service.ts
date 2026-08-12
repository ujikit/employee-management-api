import { BadRequestException, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/commons/v1/database/database.service';
import { JwtDto } from 'src/commons/v1/dtos/unique-jwt-owner.dto';
import { CreateEmployeeDto } from '../dtos/create-employee.dto';

@Injectable()
export class EmployeeService {
  constructor(private readonly dataBaseService: DatabaseService) {}

  async getEmployee(req: JwtDto) {
    const data = await this.dataBaseService.employee.findMany();

    if (!data) {
      throw new BadRequestException('translation.VALIDATION.NOT_FOUND_INTERNAL');
    }

    return {
      data,
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
