import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {

    const request = context.switchToHttp().getRequest();
    const lang = (
      request.user?.language ??
      request.headers['x-lang'] ?? 'zh'
    ).toLowerCase();
    return true;
  }
}

export interface JwtPayload {
  id: number;
  role: string;
  language: string;
  [key: string]: number | string | Date;
}

@Injectable()
export class OptionalAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
  ) { }

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest();
    const auth = req.headers?.authorization as string | undefined;

    if (!auth?.startsWith('Bearer ')) {
      req.user = null;
      return true;
    }

    const token = auth.slice(7);
    try {
      const decoded = this.jwtService.decode(token) as JwtPayload | null;

      if (!decoded || typeof decoded.role !== 'string') {
        throw new Error('Bad token payload');
      }

      req.user = {
        ...decoded,
      };
    } catch (err) {
      req.user = null;
    }

    return true;
  }
}
