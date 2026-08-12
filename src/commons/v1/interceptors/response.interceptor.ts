import {
  CallHandler,
  ExecutionContext,
  HttpException,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { translate } from '../i18n/translation.helper';

interface SuccessResponse<T> {
  statusCode: number;
  method: string;
  message: string;
  timestamp: number;
  path: string;
  data: T | null;
  meta?: {
    totalData: number;
    currentPage: number;
    perPage: number;
  };
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<
  T,
  SuccessResponse<T>
> {
  constructor() { }

  private normalizeLang(rawLang: unknown): 'en' | 'zh' {
    const value = String(rawLang ?? '')
      .split(',')[0]
      .split(';')[0]
      .trim()
      .toLowerCase();
    return value.startsWith('zh') ? 'zh' : 'en';
  }

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<SuccessResponse<T>> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const statusCode = response.statusCode;
    const method = request.method;
    const rawLang =
      (Array.isArray(request.headers['x-lang'])
        ? request.headers['x-lang'][0]
        : request.headers['x-lang']) ??
      request.user?.language ??
      'zh';
    const lang = this.normalizeLang(rawLang);

    return next.handle().pipe(
      map((data) => {
        const rawMessage = data?.message ?? 'translation.COMMON.SUCCESS';
        const message =
          typeof rawMessage === 'string' &&
            rawMessage.startsWith('translation.')
            ? translate(rawMessage, lang)
            : rawMessage;

        return {
          statusCode,
          method,
          message,
          timestamp: Date.now(),
          path: request.url,
          data: data?.data ?? null,
          ...(data?.meta && { meta: data.meta }),
        } as SuccessResponse<T>;
      }),
      catchError((err) => {
        console.error(err);

        let message =
          err.response?.message ??
          translate('translation.COMMON.INTERNAL_SERVER_ERROR', lang);
        let statusCode = err.status ?? 500;

        if (Array.isArray(err.response?.message)) {
          const convertedMessage: Record<string, string> = {};
          err.response.message.forEach((element: string) => {
            const [fieldName, translationKey] = element.split('|');
            if (fieldName && translationKey) {
              convertedMessage[fieldName] = translate(translationKey, lang);
            }
          });

          statusCode = 422;
          message = Object.keys(convertedMessage).length
            ? convertedMessage
            : err.response.message;
        }

        const alreadyHandled =
          err instanceof HttpException &&
          typeof err.getResponse() === 'object' &&
          (err.getResponse() as Record<string, unknown>)['path'] != null;

        if (statusCode >= 500 && !alreadyHandled) {
          // Send error notification to Slack using the new service
        }

        let errorCode = err.response?.errorCode || null;

        if (
          typeof err.response?.message === 'string' &&
          message.startsWith('translation.')
        ) {
          if (message.includes('MISSING_DATA_ON_ROW')) {
            message = this.processCustomTranslation(
              message,
              'MISSING_DATA_ON_ROW',
              lang,
            );
          } else if (message.includes('INVALID_FORMAT_ROW')) {
            message = this.processCustomTranslation(
              message,
              'INVALID_FORMAT_ROW',
              lang,
            );
          } else {
            if (
              message ==
              'translation.VALIDATION.STORE_HAS_BOOKINGS_CANNOT_CHANGE_PRICE_TYPE'
            ) {
              errorCode = 'STORE_HAS_BOOKINGS_CANNOT_CHANGE_PRICE_TYPE';
            }
            // Pass the exception `data` payload as interpolation args so a
            // message placeholder (e.g. `{assigned_players}`) is filled from
            // `data.assigned_players` (GF-3215). Messages without placeholders
            // are unaffected — interpolate() only replaces matching tokens.
            message = translate(message, lang, err.response?.data);
          }
        }

        const errorResponse = {
          statusCode,
          method,
          message,
          error: err.name || 'Error',
          ...(errorCode && { errorCode }),
          timestamp: Date.now(),
          path: request.url,
          data: err.response?.data || null,
        };

        console.log(errorResponse);

        if (!alreadyHandled) {
          const messageForLog = this.resolveEnMessage(err, statusCode);
        }

        return throwError(() => new HttpException(errorResponse, statusCode));
      }),
    );
  }

  private resolveEnMessage(err: unknown, statusCode: number): unknown {
    if (statusCode >= 500) {
      return null;
    }

    const errAny = err as Record<string, unknown> & {
      response?: { message?: unknown; data?: unknown };
    };
    const rawMessage = errAny?.response?.message;
    const messageArgs = errAny?.response?.data as
      Record<string, string | number> | undefined;

    if (Array.isArray(rawMessage)) {
      const convertedMessage: Record<string, string> = {};
      rawMessage.forEach((element: string) => {
        const [fieldName, translationKey] = element.split('|');
        if (fieldName && translationKey) {
          convertedMessage[fieldName] = translate(translationKey, 'en');
        }
      });
      return Object.keys(convertedMessage).length
        ? convertedMessage
        : rawMessage;
    }

    if (
      typeof rawMessage === 'string' &&
      rawMessage.startsWith('translation.')
    ) {
      if (rawMessage.includes('MISSING_DATA_ON_ROW')) {
        return this.processCustomTranslation(
          rawMessage,
          'MISSING_DATA_ON_ROW',
          'en',
        );
      }
      if (rawMessage.includes('INVALID_FORMAT_ROW')) {
        return this.processCustomTranslation(
          rawMessage,
          'INVALID_FORMAT_ROW',
          'en',
        );
      }
      return translate(rawMessage, 'en', messageArgs);
    }

    return (
      rawMessage ?? translate('translation.COMMON.INTERNAL_SERVER_ERROR', 'en')
    );
  }

  private processCustomTranslation(
    originalMessage: string,
    baseTranslationKey: string,
    lang: string,
  ): string {
    const regexPattern = new RegExp(
      `${baseTranslationKey}_\\{([^}]+)\\}_\\{(\\d+)\\}`,
    );
    const match = originalMessage.match(regexPattern);

    if (match) {
      const columnName = match[1];
      const rowNumber = match[2];
      const translatedColumnName = translate(
        `translation.FIELD.${columnName}`,
        lang,
      );
      return translate(`translation.VALIDATION.${baseTranslationKey}`, lang, {
        column_name: translatedColumnName,
        row_number: rowNumber,
      });
    } else {
      return translate(`translation.VALIDATION.${baseTranslationKey}`, lang);
    }
  }
}
