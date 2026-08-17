import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class GetRolesFilterDto {
  @ApiPropertyOptional({ example: 'SUPERADMIN' })
  @IsOptional()
  @IsString({ message: 'name|translation.CLASS_VALIDATION.IS_STRING' })
  name?: string;
}
