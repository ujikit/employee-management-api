import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Role, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { DatabaseService } from 'src/commons/v1/database/database.service';
import { JwtSuperAdminDto } from 'src/commons/v1/dtos/unique-jwt-owner.dto';
import { exclude } from 'src/commons/v1/helpers/exclude';
import { NotifyEngineService } from 'src/commons/v1/notify/notify-engine.service';
import { SuperAdminPostSignInDto } from '../dtos/superadmin-post-signin.dto';
import { SuperAdminPostSignInVerifyOtpDto } from '../dtos/superadmin-post-signinVerifyOtp.dto';

@Injectable()
export class SuperAdminAuthenticationService {
  constructor(private readonly dataBaseService: DatabaseService,
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


  async signIn(body: SuperAdminPostSignInDto) {
    const { email, phone, phone_code, password } = body;

    if (!email && (!phone || !phone_code)) {
      throw new BadRequestException('translation.VALIDATION.EMAIL_OR_PHONE_REQUIRED');
    }

    let user: User | null = null;
    let role: Role | null = null;

    if (email) {
      user = await this.dataBaseService.user.findUnique({ where: { email } });
    }

    if (!user)
      throw new UnauthorizedException(
        'translation.VALIDATION.WRONG_CREDENTIALS',
      );
    const isMatch = await bcrypt.compare(password || '', user.password);

    if (!isMatch)
      throw new UnauthorizedException(
        'translation.VALIDATION.WRONG_CREDENTIALS',
      );

    const payload = {
      ...exclude(user, [
        'password',
        'created_at',
        'updated_at',
        'deleted_at',
      ]),
    };

    role = await this.dataBaseService.role.findUnique({ where: { id: user.id } });


    return {
      data: {
        ...exclude(user, ['password']),
        role: role?.code,
        access_token: await this.jwtService.signAsync(payload, {
          expiresIn: '7d',
        }),
      },
    };
  }

  async signInGenerateOtp(
    body: SuperAdminPostSignInDto,
    lang: string,
  ) {
    const { email, phone, phone_code, password } = body;

    let user: User | null = null;

    if (email) {
      user = await this.dataBaseService.user.findFirst({
        where: { email, deleted_at: null },
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

    const result = await this.dataBaseService.$transaction(async () => {
      await this.dataBaseService.loginOtp.updateMany({
        where: {
          user_id: user.id,
        },
        data: {
          updated_at: new Date(),
        },
      });

      let code;
      if ((process.env.DEPLOYMENT_ENVIRONMENT || 'develop') === 'develop') {
        code = '0000';
      } else {
        code = (
          Math.floor(Math.random() * (9999 - 1234 + 1)) + 1234
        ).toString();
      }
      const verification = await this.dataBaseService.loginOtp.create({
        data: {
          user_id: user.id,
          otp_hash: code,
          sent_to: email || '',
          expires_at: new Date(Date.now() + 3 * 60 * 1000),
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

  async signInVerifyOtp(body: SuperAdminPostSignInVerifyOtpDto) {
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

    if (!verificationCode) {
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
      expiresIn: '1d',
    });

    return {
      data: {
        ...exclude(user, ['password']),
        access_token: token,
      },
    };
  }



  async getMe(req: JwtSuperAdminDto) {
    const id = req.user.id;
    const user = await this.dataBaseService.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new BadRequestException('translation.VALIDATION.NOT_FOUND_INTERNAL');
    }

    return {
      data: {
        ...exclude(user, ['password']),  // ✅ guaranteed non-null
      },
    };
  }

















































































};
