import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, ValidateIf } from 'class-validator';

export class AllowancePeriodModuleDto {
  @ApiPropertyOptional({ example: 'user@example.com' })
  @IsOptional()
  @IsEmail({}, { message: 'email|translation.CLASS_VALIDATION.IS_EMAIL' })
  email?: string;

  @ApiPropertyOptional({ example: '81234567890' })
  @IsOptional()
  @IsString({ message: 'phone|translation.CLASS_VALIDATION.IS_STRING' })
  phone?: string;

  @ApiPropertyOptional({ example: '+62' })
  @ValidateIf(o => !!o.phone)
  @IsNotEmpty({ message: 'phone_code|translation.CLASS_VALIDATION.IS_NOT_EMPTY_PHONE_CODE' })
  @IsString({ message: 'phone_code|translation.CLASS_VALIDATION.IS_STRING' })
  phone_code?: string;

  @IsNotEmpty({ message: 'password|translation.CLASS_VALIDATION.IS_NOT_EMPTY_PASSWORD' })
  password: string | undefined;

  otp_code: string | undefined;
}
