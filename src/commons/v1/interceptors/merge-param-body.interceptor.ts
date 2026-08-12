import { Injectable, ExecutionContext, NestInterceptor, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class MergeParamAndBodyInterceptor implements NestInterceptor {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();

    if (req.body && req.params) {
      req.body = { ...req.body, ...req.params };
    }

    return next.handle();
  }
}
