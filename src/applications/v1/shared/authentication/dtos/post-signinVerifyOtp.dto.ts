import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class PostSignInVerifyOtpDto {
  @ApiPropertyOptional({ example: 'admin@example.com' })
  @IsEmail({}, { message: 'email|translation.CLASS_VALIDATION.IS_EMAIL' })
  email?: string;

  @ApiProperty({ example: '123456' })
  @IsNotEmpty({ message: 'otp_code|translation.CLASS_VALIDATION.IS_NOT_EMPTY_OTP' })
  otp_code: string | undefined;
}
