import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/commons/v1/database/database.service';
import { JwtDto } from 'src/commons/v1/dtos/unique-jwt-owner.dto';
import { CreateEmployeeDto } from '../dtos/create-employee.dto';

@Injectable()
export class EmployeeService {
  constructor(private readonly dataBaseService: DatabaseService) {}

  async getEmployee(req: JwtDto) {
    const data = await this.dataBaseService.employee.findMany({
      orderBy: { id: 'asc' },
    });
    return { data };
  }

  async createEmployee(req: JwtDto, body: CreateEmployeeDto) {
    const { educations, ...employeeData } = body;

    const data = await this.dataBaseService.employee.create({
      data: {
        ...employeeData,
        birth_date: new Date(body.birth_date),
        joined_at: new Date(body.joined_at),
      },
    });

    return { data };
  }
}
