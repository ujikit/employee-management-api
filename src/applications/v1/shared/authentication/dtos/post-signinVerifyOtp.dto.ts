import { IsEmail, IsNotEmpty } from 'class-validator';

export class PostSignInVerifyOtpDto {
  @IsEmail({}, { message: 'email|translation.CLASS_VALIDATION.IS_EMAIL' })
  email?: string;

  @IsNotEmpty({ message: 'otp_code|translation.CLASS_VALIDATION.IS_NOT_EMPTY_OTP' })
  otp_code: string | undefined;
}
