import { BadRequestException, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/commons/v1/database/database.service';
import { JwtDto } from 'src/commons/v1/dtos/unique-jwt-owner.dto';

@Injectable()
export class AttendanceService {
  constructor(private readonly dataBaseService: DatabaseService,
  ) { }

  async getAttendance(req: JwtDto) {
    const id = req.user.id;
    const now = new Date();
    const startOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfPrevMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

    // get previous month of attendance
    const data = await this.dataBaseService.attendance.findMany({
      where: {
        created_at: {
          gte: startOfPrevMonth,
          lte: endOfPrevMonth,
        },
      },
    });

    if (!data) {
      throw new BadRequestException('translation.VALIDATION.NOT_FOUND_INTERNAL');
    }

    return {
      data,
    };
  }
};
