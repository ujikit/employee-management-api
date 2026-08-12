import { wrapMethod, MAX_FN_LOGS_PER_TRACE } from './function-logging';
import { traceContext } from './trace-context';
import { logger } from './logger';

describe('wrapMethod', () => {
  let entries: { level: string; obj: Record<string, unknown> }[];
  beforeEach(() => {
    entries = [];
    for (const level of ['info', 'error', 'warn'] as const) {
      jest
        .spyOn(logger, level)
        .mockImplementation(((obj: Record<string, unknown>) => {
          entries.push({ level, obj });
        }) as never);
    }
  });
  afterEach(() => jest.restoreAllMocks());

  it('logs class/function/duration with trace_id inside a trace context', async () => {
    const wrapped = wrapMethod('CustomerService', 'find', async (id) => ({
      id,
      password: 'x',
    }));
    const result = await traceContext.run({ traceId: 't-1' }, () =>
      wrapped(1741),
    );

    expect(result).toEqual({ id: 1741, password: 'x' });
    expect(entries[0].level).toBe('info');
    expect(entries[0].obj).toMatchObject({
      event: 'function',
      trace_id: 't-1',
      class: 'CustomerService',
      function: 'find',
    });
    expect(entries[0].obj.duration_ms as number).toBeGreaterThanOrEqual(0);
    // payloads only at debug level
    expect(entries[0].obj.input).toBeUndefined();
    expect(entries[0].obj.output).toBeUndefined();
  });

  it('includes redacted input/output when debug is enabled', async () => {
    jest.spyOn(logger, 'isLevelEnabled').mockReturnValue(true);
    const wrapped = wrapMethod('CustomerService', 'find', async (id) => ({
      id,
      password: 'x',
    }));
    await traceContext.run({ traceId: 't-1' }, () => wrapped(1741));

    expect(entries[0].obj.input).toBe('[1741]');
    expect(entries[0].obj.output).toContain('[REDACTED]');
  });

  it('logs error with input on throw and rethrows', async () => {
    const wrapped = wrapMethod('X', 'boom', async () => {
      throw new Error('nope');
    });
    await expect(
      traceContext.run({ traceId: 't-2' }, () => wrapped(7)),
    ).rejects.toThrow('nope');
    expect(entries[0].level).toBe('error');
    expect(entries[0].obj).toMatchObject({ error: 'nope', input: '[7]' });
  });

  it('caps log lines per request: N lines + 1 warning, then silence', () => {
    const wrapped = wrapMethod('X', 'hot', (n: unknown) => n);
    traceContext.run({ traceId: 't-3' }, () => {
      for (let i = 0; i < MAX_FN_LOGS_PER_TRACE + 50; i++) wrapped(i);
    });
    expect(entries).toHaveLength(MAX_FN_LOGS_PER_TRACE + 1);
    expect(entries[MAX_FN_LOGS_PER_TRACE].level).toBe('warn');
  });

  it('is a silent passthrough outside a trace context', () => {
    const wrapped = wrapMethod('X', 'y', (n: unknown) => (n as number) + 1);
    expect(wrapped(1)).toBe(2);
    expect(entries).toHaveLength(0);
  });
});
