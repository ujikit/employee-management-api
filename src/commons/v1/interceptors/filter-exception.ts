import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { translate } from '../i18n/translation.helper';

@Catch(HttpException)
export class FilterException implements ExceptionFilter {
  private normalizeLang(request: Record<string, unknown>): string {
    const headers = request.headers as Record<string, unknown>;
    const xLang = Array.isArray(headers?.['x-lang'])
      ? headers['x-lang'][0]
      : headers?.['x-lang'];
    const user = request.user as { language?: string } | null;
    return (xLang as string) ?? user?.language ?? 'zh';
  }

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();
    const lang = this.normalizeLang(request);

    const rawMessage =
      exceptionResponse['message'] || exception.message || 'An error occurred';

    let message: unknown;
    if (
      typeof rawMessage === 'string' &&
      rawMessage.startsWith('translation.')
    ) {
      message = translate(
        rawMessage,
        lang,
        exceptionResponse['data'] as
          Record<string, string | number> | undefined,
      );
    } else if (Array.isArray(rawMessage)) {
      // Two entry shapes are supported per validation error:
      //   'field|translation.KEY' → mapped into { field: <translated> }
      //   'translation.KEY'       → collected as a plain translated string
      const converted: Record<string, string> = {};
      const plain: string[] = [];
      rawMessage.forEach((element: string) => {
        const [fieldName, translationKey] = element.split('|');
        if (fieldName && translationKey) {
          converted[fieldName] = translate(translationKey, lang);
        } else if (
          typeof element === 'string' &&
          element.startsWith('translation.')
        ) {
          plain.push(translate(element, lang));
        }
      });
      if (Object.keys(converted).length) {
        message = converted;
      } else if (plain.length) {
        // Collapse a single message to a flat string (FE wants `message: string`);
        // keep an array only when several plain messages were raised at once.
        message = plain.length === 1 ? plain[0] : plain;
      } else {
        message = rawMessage;
      }
    } else if (rawMessage !== null && typeof rawMessage === 'object') {
      const converted: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(
        rawMessage as Record<string, unknown>,
      )) {
        converted[key] =
          typeof value === 'string' && value.startsWith('translation.')
            ? translate(value, lang)
            : value;
      }
      message = converted;
    } else {
      message = rawMessage;
    }

    const errorResponse = {
      code: status,
      method: request.method,
      message,
      error: exception.name || 'Error',
      ...(exceptionResponse['errorCode'] && {
        errorCode: exceptionResponse['errorCode'],
      }),
      timestamp: Date.now(),
      path: request.url,
      data: exceptionResponse['data'] || null,
    };

    response.status(status).json(errorResponse);
  }
}
