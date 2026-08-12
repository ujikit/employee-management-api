import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { User } from '@prisma/client';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { DatabaseService } from '../database/database.service';
import { translate } from '../i18n/translation.helper';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly dataBaseService: DatabaseService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload) {
    let user: User | null = null;
    let storeId;

    if (payload.id) {
      user = await this.dataBaseService.user.findUnique({
        where: { id: payload.id },
      });
    } else {
      throw new UnauthorizedException();
    }


    if (!user) {
      throw new UnauthorizedException(
        translate('translation.VALIDATION.UNAUTHORIZED', 'zh'),
      );
    }

    return payload;
  }
}
