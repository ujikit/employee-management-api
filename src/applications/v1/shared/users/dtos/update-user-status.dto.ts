import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateUserStatusDto {
  @ApiProperty({ example: 'INACTIVE', description: 'Status value (e.g., ACTIVE, INACTIVE)' })
  @IsNotEmpty({ message: 'status|translation.CLASS_VALIDATION.IS_NOT_EMPTY' })
  @IsString({ message: 'status|translation.CLASS_VALIDATION.IS_STRING' })
  status!: string;
}
