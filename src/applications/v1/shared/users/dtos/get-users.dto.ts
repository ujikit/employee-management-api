import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, Min } from 'class-validator';

export class GetUsersQueryDto {
  @ApiPropertyOptional({ example: 1, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'page|translation.CLASS_VALIDATION.IS_INT' })
  @Min(1, { message: 'page|translation.CLASS_VALIDATION.MIN_ONE' })
  page?: number = 1;

  @ApiPropertyOptional({ example: 10, default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'limit|translation.CLASS_VALIDATION.IS_INT' })
  @Min(1, { message: 'limit|translation.CLASS_VALIDATION.MIN_ONE' })
  limit?: number = 10;

  @ApiPropertyOptional({ example: 'id', description: 'Allowed fields: id, name, username, status' })
  @IsOptional()
  @IsIn(['id', 'name', 'username', 'status'], {
    message: 'sort_by|translation.CLASS_VALIDATION.IS_IN',
  })
  sort_by?: 'id' | 'name' | 'username' | 'status' = 'id';

  @ApiPropertyOptional({ example: 'asc', description: 'Allowed order: asc, desc' })
  @IsOptional()
  @IsIn(['asc', 'desc'], {
    message: 'sort_order|translation.CLASS_VALIDATION.IS_IN',
  })
  sort_order?: 'asc' | 'desc' = 'asc';
}
