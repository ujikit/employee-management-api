import { BadRequestException, Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../../../commons/v1/database/database.service';
import { JwtDto } from '../../../../../commons/v1/dtos/unique-jwt-owner.dto';

@Injectable()
export class AllowanceDetailService {
  constructor(private readonly dataBaseService: DatabaseService,
  ) { }

  async getAllowanceDetail(req: JwtDto) {
    const id = req.user.id;
    const data = await this.dataBaseService.transportAllowanceDetail.findMany({
      include: {
        employee: true,
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
