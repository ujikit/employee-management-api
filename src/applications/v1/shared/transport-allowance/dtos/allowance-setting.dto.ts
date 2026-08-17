import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNumber, IsOptional, Min } from 'class-validator';

export class UpdateAllowanceSettingDto {
  @ApiPropertyOptional({ example: 50000, description: 'Base transport allowance fare' })
  @IsOptional()
  @IsNumber({}, { message: 'base_fare|translation.CLASS_VALIDATION.IS_NUMBER' })
  @Min(0, { message: 'base_fare|translation.CLASS_VALIDATION.MIN_ZERO' })
  base_fare?: number;

  @ApiPropertyOptional({ example: '2026-01-01T00:00:00.000Z', description: 'Effective start date' })
  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: 'effective_start|translation.CLASS_VALIDATION.IS_DATE' })
  effective_start?: Date;

  @ApiPropertyOptional({ example: 0, description: 'Minimum distance in kilometers' })
  @IsOptional()
  @IsNumber({}, { message: 'min_km|translation.CLASS_VALIDATION.IS_NUMBER' })
  @Min(0, { message: 'min_km|translation.CLASS_VALIDATION.MIN_ZERO' })
  min_km?: number;

  @ApiPropertyOptional({ example: 50, description: 'Maximum distance in kilometers' })
  @IsOptional()
  @IsNumber({}, { message: 'max_km|translation.CLASS_VALIDATION.IS_NUMBER' })
  @Min(0, { message: 'max_km|translation.CLASS_VALIDATION.MIN_ZERO' })
  max_km?: number;
}
