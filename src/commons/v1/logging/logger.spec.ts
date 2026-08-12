import { redact, responseBodyPreview, truncate } from './logger';

describe('redact/truncate', () => {
  it('redacts sensitive keys recursively', () => {
    expect(
      redact({ password: 'x', nested: { access_token: 'y', ok: 1 } }),
    ).toEqual({
      password: '[REDACTED]',
      nested: { access_token: '[REDACTED]', ok: 1 },
    });
  });

  it('truncates oversized output', () => {
    expect(truncate({ big: 'a'.repeat(20_000) })).toContain('[TRUNCATED');
  });

  it('never traverses class instances (e.g. a Prisma client in args)', () => {
    class FakePrismaClient {
      huge = { nested: { graph: {} } };
    }
    expect(redact([new FakePrismaClient(), 42])).toEqual([
      '[FakePrismaClient]',
      42,
    ]);
  });

  it('previews response bodies: errors always, successes only when small', () => {
    expect(responseBodyPreview(200, undefined)).toBeUndefined();
    expect(responseBodyPreview(200, { data: { id: 62 } })).toEqual({
      data: { id: 62 },
    });
    expect(
      responseBodyPreview(200, {
        data: Array.from({ length: 10 }, () => 'x'.repeat(500)),
      }),
    ).toMatch(/^\[body omitted: \d+ chars\]$/);
    expect(responseBodyPreview(422, { data: 'x'.repeat(3_000) })).toEqual({
      data: 'x'.repeat(2_000) + '…[+1000 chars]',
    });
  });

  it('caps arrays, strings, and depth', () => {
    const capped = redact(Array.from({ length: 500 }, (_, i) => i)) as unknown[];
    expect(capped).toHaveLength(11);
    expect(capped[10]).toBe('…[+490 more]');
    expect((redact('a'.repeat(5_000)) as string).length).toBeLessThan(2_100);
    expect(redact({ a: { b: { c: { d: { e: 1 } } } } })).toEqual({
      a: { b: { c: { d: '[Object]' } } },
    });
  });
});
