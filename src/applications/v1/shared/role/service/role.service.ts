import { BadRequestException, Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../../../commons/v1/database/database.service';
import { JwtDto } from '../../../../../commons/v1/dtos/unique-jwt-owner.dto';

@Injectable()
export class RoleService {
  constructor(private readonly dataBaseService: DatabaseService) { }

  async getRoles(req: JwtDto) {
    const data = await this.dataBaseService.role.findMany({
      orderBy: { id: 'asc' },
    });

    if (!data) {
      throw new BadRequestException('translation.VALIDATION.NOT_FOUND_INTERNAL');
    }

    return {
      data,
    };
  }
}
