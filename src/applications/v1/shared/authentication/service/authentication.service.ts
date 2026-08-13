import { Injectable, UnauthorizedException } from '@nestjs/common';
import { DatabaseService } from 'src/commons/v1/database/database.service';
import { JwtDto } from 'src/commons/v1/dtos/unique-jwt-owner.dto';
import { PostSignInDto } from '../dtos/post-signin.dto';
import { PostSignInVerifyOtpDto } from '../dtos/post-signinVerifyOtp.dto';

@Injectable()
export class AuthenticationService {
  constructor(private readonly db: DatabaseService) {}

  async signInGenerateOtp(body: PostSignInDto, lang: string) {
    return { message: 'OTP generated successfully', lang };
  }

  async signInVerifyOtp(body: PostSignInVerifyOtpDto) {
    return { access_token: 'mock-jwt-token' };
  }

  async getMe(req: JwtDto) {
    const userId = (req.user as any)?.id || (req as any)?.id;
    const user = await this.db.user.findUnique({ where: { id: userId } });
    if (!user) throw new UnauthorizedException();
    return { data: user };
  }
}
