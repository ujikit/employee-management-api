import { IsEmail } from 'class-validator';

export class SuperAdminPostSignInVerifyOtpDto {
  @IsEmail({}, { message: 'email|translation.CLASS_VALIDATION.IS_EMAIL' })
  email?: string;

  otp_code: string | undefined;
}
