import { INestApplication } from '@nestjs/common';
import { ModulesContainer } from '@nestjs/core';
import { logger, redact, truncate } from './logger';
import { traceContext } from './trace-context';

/**
 * Wraps every DI provider method so each call inside a /api/v1 request emits
 * one JSON line: trace_id, class, function, duration_ms. INFO on return,
 * ERROR on throw. input/output payloads are serialized only at
 * LOG_LEVEL=debug (or on error) — serializing them per call is what made
 * FUNCTION_LOGGING cost seconds per request. Outside a v4 request (no trace
 * context: crons, boot, v1-v3) the wrapper is a passthrough — zero logging,
 * near-zero overhead.
 *
 * ponytail: covers DI providers only. Controllers are logged by the
 * nestjs-pino HTTP line (wrapping them post-init wouldn't take effect —
 * Nest captures route handler references at startup), and free-function
 * helpers can't be auto-wrapped; instrument those manually or with
 * OpenTelemetry if ever needed.
 */
// ponytail: only business-layer classes. Wrapping everything logged hot
// math helpers too — TypeBCalculator.findBalancedGreenFee brute-forces up
// to ~10k calculateRoundedTaxes calls per price, flooding the logs.
const WRAPPED_CLASS = /(Service|Repository|Strategy|Helper)$/;

// Hard ceiling per request, whatever gets wrapped: after this many function
// lines, one WARNING is emitted and the rest of the request logs nothing.
export const MAX_FN_LOGS_PER_TRACE = 100;

export function instrumentFunctionLogging(app: INestApplication) {
  const modules = app.get(ModulesContainer);
  const seen = new Set<object>();

  for (const module of modules.values()) {
    for (const wrapper of module.providers.values()) {
      const { instance, metatype } = wrapper;
      // Only wrap real DI class prototypes. useValue/useFactory providers can
      // be plain arrays/objects whose prototype is a BUILT-IN (Array.prototype
      // etc.) — wrapping those patches globals Node's internals call and
      // crashes async_hooks.
      const proto =
        typeof metatype === 'function' ? metatype.prototype : undefined;
      if (
        !instance ||
        typeof instance !== 'object' ||
        !proto ||
        proto === Object.prototype ||
        typeof metatype !== 'function' ||
        !(instance instanceof metatype) ||
        seen.has(proto)
      )
        continue;
      seen.add(proto);

      const className = proto.constructor?.name ?? 'Unknown';
      if (!WRAPPED_CLASS.test(className)) continue;
      for (const name of Object.getOwnPropertyNames(proto)) {
        if (name === 'constructor') continue;
        const descriptor = Object.getOwnPropertyDescriptor(proto, name);
        if (!descriptor || typeof descriptor.value !== 'function') continue;
        proto[name] = wrapMethod(className, name, descriptor.value);
      }
    }
  }
}

export function wrapMethod(
  className: string,
  methodName: string,
  fn: (...args: unknown[]) => unknown,
) {
  return function (this: unknown, ...args: unknown[]) {
    const store = traceContext.getStore();
    if (!store) return fn.apply(this, args);

    store.fnLogs = (store.fnLogs ?? 0) + 1;
    if (store.fnLogs > MAX_FN_LOGS_PER_TRACE) {
      if (store.fnLogs === MAX_FN_LOGS_PER_TRACE + 1) {
        logger.warn(
          { event: 'function', trace_id: store.traceId },
          `function log cap (${MAX_FN_LOGS_PER_TRACE}) reached; further calls in this request are not logged`,
        );
      }
      return fn.apply(this, args);
    }

    const startedAt = Date.now();
    const debug = logger.isLevelEnabled('debug');
    const finish = (
      level: 'info' | 'error',
      extra: Record<string, unknown>,
    ) =>
      logger[level]({
        event: 'function',
        trace_id: store.traceId,
        class: className,
        function: methodName,
        duration_ms: Date.now() - startedAt,
        ...extra,
      });

    try {
      const result = fn.apply(this, args);
      if (result instanceof Promise) {
        return result.then(
          (value) => {
            finish(
              'info',
              debug
                ? {
                  input: truncate(redact(args)),
                  output: truncate(redact(value)),
                }
                : {},
            );
            return value;
          },
          (err) => {
            finish('error', {
              input: truncate(redact(args)),
              error: err?.message ?? String(err),
            });
            throw err;
          },
        );
      }
      finish(
        'info',
        debug
          ? { input: truncate(redact(args)), output: truncate(redact(result)) }
          : {},
      );
      return result;
    } catch (err) {
      finish('error', {
        input: truncate(redact(args)),
        error: (err as Error)?.message ?? String(err),
      });
      throw err;
    }
  };
}
