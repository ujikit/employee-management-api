import pino from 'pino';

// Single shared pino instance for all app logging (HTTP lines via
// nestjs-pino in AppModule, function lines via function-logging.ts, and
// Nest's own Logger via app.useLogger in main.ts). Writes are buffered and
// asynchronous (sync: false) so logging never blocks the event loop — the
// last few lines can be lost on a hard crash (SIGKILL), which is the
// accepted trade-off for not paying request latency.
// LOG_LEVEL=debug additionally emits function input/output payloads.
export const logger = pino(
  {
    level: process.env.LOG_LEVEL ?? 'info',
    base: undefined, // drop pid/hostname
    timestamp: () => `,"timestamp":"${new Date().toISOString()}"`,
    formatters: { level: (label) => ({ level: label.toUpperCase() }) },
  },
  pino.destination({ sync: false }),
);

const SENSITIVE_KEY = /password|token|secret|authorization|credential/i;
const MAX_OUTPUT_CHARS = 10_000;
// ponytail: hard caps so logging one call can never build a large copy in
// memory (a repo method receiving the Prisma client as an arg once ballooned
// the heap to 3GB). Raise caps only with a heap profile in hand.
const MAX_DEPTH = 4;
const MAX_ARRAY_ITEMS = 10;
const MAX_STRING_CHARS = 2_000;

// Mask sensitive values and build a BOUNDED preview of the payload for the
// logs: caps depth/array length/string length, and never deep-copies class
// instances (PrismaClient, req/res, streams, …) — only plain data.
export function redact(value: unknown, depth = 0): unknown {
  if (typeof value === 'string') {
    return value.length > MAX_STRING_CHARS
      ? value.slice(0, MAX_STRING_CHARS) + `…[+${value.length - MAX_STRING_CHARS} chars]`
      : value;
  }
  if (value === null || typeof value !== 'object') return value;
  if (depth >= MAX_DEPTH) {
    return Array.isArray(value) ? `[Array(${value.length})]` : '[Object]';
  }
  if (Array.isArray(value)) {
    const head = value
      .slice(0, MAX_ARRAY_ITEMS)
      .map((v) => redact(v, depth + 1));
    if (value.length > MAX_ARRAY_ITEMS) {
      head.push(`…[+${value.length - MAX_ARRAY_ITEMS} more]`);
    }
    return head;
  }
  const proto = Object.getPrototypeOf(value);
  if (proto !== Object.prototype && proto !== null) {
    // Class instance. Date/Decimal serialize via toJSON; everything else
    // (PrismaClient, transactions, requests…) is named, never traversed.
    const toJSON = (value as { toJSON?: () => unknown }).toJSON;
    if (typeof toJSON === 'function') {
      try {
        return redact(toJSON.call(value), depth + 1);
      } catch {
        /* fall through to class name */
      }
    }
    return `[${proto.constructor?.name ?? 'Object'}]`;
  }
  const out: Record<string, unknown> = {};
  for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
    out[key] = SENSITIVE_KEY.test(key) ? '[REDACTED]' : redact(val, depth + 1);
  }
  return out;
}

const MAX_SUCCESS_BODY_CHARS = 2_048;

// Response-body preview for the HTTP log line: 4xx/5xx always get the
// redacted body; 2xx/3xx only when small, so list endpoints don't bloat
// OpenObserve storage. redact() bounds the work per call regardless.
export function responseBodyPreview(
  statusCode: number,
  payload: unknown,
): unknown {
  if (payload === undefined) return undefined;
  const preview = redact(payload);
  if (statusCode >= 400) return preview;
  let size: number;
  try {
    size = JSON.stringify(preview)?.length ?? 0;
  } catch {
    return '[UNSERIALIZABLE]';
  }
  return size <= MAX_SUCCESS_BODY_CHARS
    ? preview
    : `[body omitted: ${size} chars]`;
}

export function truncate(value: unknown): string {
  let json: string;
  try {
    json = JSON.stringify(value) ?? 'undefined';
  } catch {
    return '[UNSERIALIZABLE]';
  }
  return json.length > MAX_OUTPUT_CHARS
    ? json.slice(0, MAX_OUTPUT_CHARS) + `…[TRUNCATED ${json.length} chars]`
    : json;
}
