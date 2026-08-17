import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { DatabaseService } from '../../../../../commons/v1/database/database.service';
import { JwtDto } from '../../../../../commons/v1/dtos/unique-jwt-owner.dto';
import { exclude } from '../../../../../commons/v1/helpers/exclude';
import { NotifyEngineService } from '../../../../../commons/v1/notify/notify-engine.service';
import { PostSignInDto } from '../dtos/post-signin.dto';
import { PostSignInVerifyOtpDto } from '../dtos/post-signinVerifyOtp.dto';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly dataBaseService: DatabaseService,
    private readonly jwtService: JwtService,
    private readonly notify: NotifyEngineService
  ) { }

  private async sendSuperAdminTemplate(
    name: string,
    opts: {
      email?: string | null;
      lang?: string | null;
      vars?: Record<string, string | number | boolean>;
    },
  ) {
    const lang = 'en';
    const vars = opts.vars ?? {};

    if (opts.email) {
      await this.notify.sendEmailByTemplate({
        section: 'SuperAdmin',
        name,
        to: opts.email,
        lang,
        vars,
      });
    }
  }

  async signInGenerateOtp(
    body: PostSignInDto,
    lang: string,
  ) {
    const { email, password } = body;

    let user: User | null = null;

    if (email) {
      user = await this.dataBaseService.user.findFirst({
        where: {
          email,
          deleted_at: null,
          status: 'ACTIVE'
        },
      });
    }

    if (!user) {
      throw new UnauthorizedException(
        'translation.VALIDATION.WRONG_CREDENTIALS',
      );
    }

    const isMatch = await bcrypt.compare(password || '', user.password);
    if (!isMatch) {
      throw new UnauthorizedException(
        'translation.VALIDATION.WRONG_CREDENTIALS',
      );
    }

    const result = await this.dataBaseService.$transaction(async (tx) => {
      await tx.loginOtp.updateMany({
        where: {
          user_id: user.id,
        },
        data: {
          updated_at: new Date(),
        },
      });

      // Delete previous unverified OTP records for this email
      await tx.loginOtp.deleteMany({
        where: {
          sent_to: email || '',
          verified_at: null,
        },
      });

      let code;
      if ((process.env.ENVIRONMENT || 'development') === 'development') {
        code = '0000';
      } else {
        code = (
          Math.floor(Math.random() * (9999 - 1234 + 1)) + 1234
        ).toString();
      }

      const verification = await tx.loginOtp.create({
        data: {
          user_id: user.id,
          otp_hash: code,
          sent_to: email || '',
          expires_at: new Date(Date.now() + 3 * 60 * 1000), // 3 minutes
        },
      });

      await this.sendSuperAdminTemplate('Sign In', {
        email: email,
        lang,
        vars: { otp_code: verification.otp_hash },
      });

      return verification;
    });

    return {
      data: exclude(result, ['otp_hash']),
    };
  }

  async signInVerifyOtp(body: PostSignInVerifyOtpDto) {
    const email = body.email;
    const user = await this.dataBaseService.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new BadRequestException(
        'translation.VALIDATION.NOT_FOUND_INTERNAL',
      );
    }

    const verificationCode =
      await this.dataBaseService.loginOtp.findFirst({
        where: {
          sent_to: body.email,
          otp_hash: body.otp_code,
          verified_at: null,
        },
      });

    if (!verificationCode || verificationCode.otp_hash !== body.otp_code) {
      throw new BadRequestException('translation.VALIDATION.INVALID_OTP');
    }

    if (verificationCode.expires_at < new Date()) {
      throw new BadRequestException('translation.VALIDATION.EXPIRED_OTP');
    }

    await this.dataBaseService.loginOtp.update({
      where: { id: verificationCode.id },
      data: { verified_at: new Date() },
    });

    const payload = {
      ...exclude(user, [
        'password',
        'created_at',
        'updated_at',
        'deleted_at',
      ]),
    };

    const token = await this.jwtService.signAsync(payload, {
      expiresIn: '7d',
    });

    return {
      data: {
        ...exclude(user, ['password']),
        access_token: token,
      },
    };
  }

  async getMe(req: JwtDto) {
    const id = req.user.id;
    const user = await this.dataBaseService.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new BadRequestException('translation.VALIDATION.NOT_FOUND_INTERNAL');
    }

    return {
      data: {
        ...exclude(user, ['password']),
      },
    };
  }
}
