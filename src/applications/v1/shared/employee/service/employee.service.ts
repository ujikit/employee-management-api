import { BadRequestException, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/commons/v1/database/database.service';
import { JwtDto } from 'src/commons/v1/dtos/unique-jwt-owner.dto';

@Injectable()
export class EmployeeService {
  constructor(private readonly dataBaseService: DatabaseService,
  ) { }

  async getEmployee(req: JwtDto) {
    const id = req.user.id;
    const data = await this.dataBaseService.employee.findMany();

    if (!data) {
      throw new BadRequestException('translation.VALIDATION.NOT_FOUND_INTERNAL');
    }

    return {
      data,
    };
  }
};
