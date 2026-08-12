import { AsyncLocalStorage } from 'node:async_hooks';

// Carries the request's traceId across every async hop so any function can
// log it without threading it through arguments. Set by the /api/v1
// middleware in main.ts; empty outside a v4 request (crons, v1-v3, boot).
export const traceContext = new AsyncLocalStorage<{
  traceId: string;
  fnLogs?: number; // function-log lines emitted for this request (cap counter)
}>();
