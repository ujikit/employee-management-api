import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly db: DatabaseService,
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
    private readonly config: ConfigService,
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
