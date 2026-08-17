import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../../../../../commons/v1/database/database.service';
import { JwtDto } from '../../../../../commons/v1/dtos/unique-jwt-owner.dto';
import { UpdateAllowanceSettingDto } from '../dtos/allowance-setting.dto';

@Injectable()
export class AllowanceSettingService {
  constructor(private readonly dataBaseService: DatabaseService) { }

  async getAllowanceSetting(req: JwtDto) {
    const data = await this.dataBaseService.transportAllowanceSetting.findMany({
      orderBy: { id: 'asc' },
    });

    if (!data) {
      throw new BadRequestException('translation.VALIDATION.NOT_FOUND_INTERNAL');
    }

    return { data };
  }

  async updateSetting(id: number, body: UpdateAllowanceSettingDto, req: JwtDto) {
    const existing = await this.dataBaseService.transportAllowanceSetting.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('translation.VALIDATION.NOT_FOUND');
    }

    const updateData: Record<string, any> = {};

    if (body.base_fare !== undefined) updateData.base_fare = body.base_fare;
    if (body.effective_start !== undefined) updateData.effective_start = new Date(body.effective_start);
    if (body.min_km !== undefined) updateData.min_km = body.min_km;
    if (body.max_km !== undefined) updateData.max_km = body.max_km;

    if (Object.keys(updateData).length === 0) {
      throw new BadRequestException('translation.VALIDATION.NO_FIELDS_TO_UPDATE');
    }

    const data = await this.dataBaseService.transportAllowanceSetting.update({
      where: { id },
      data: updateData,
    });

    return { data };
  }
}
