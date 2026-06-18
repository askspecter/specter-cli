import { describe, it, expect } from 'vitest';
import { computeScore, computeVerify, isValidAddress } from '../engine.js';

const ADDR = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045';

describe('isValidAddress()', () => {
  it('accepts valid 0x addresses', () => {
    expect(isValidAddress(ADDR)).toBe(true);
    expect(isValidAddress('0x0000000000000000000000000000000000000000')).toBe(true);
    expect(isValidAddress('0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF')).toBe(true);
  });
  it('rejects invalid addresses', () => {
    expect(isValidAddress('not-an-address')).toBe(false);
    expect(isValidAddress('0xinvalid')).toBe(false);
    expect(isValidAddress('')).toBe(false);
    expect(isValidAddress('0x123')).toBe(false);
    expect(isValidAddress('d8dA6BF26964aF9D7eEd9e03E53415D37aA96045')).toBe(false);
  });
});

describe('computeScore()', () => {
  it('returns score in valid range', () => {
    const res = computeScore(ADDR);
    expect(res.score).toBeGreaterThanOrEqual(55);
    expect(res.score).toBeLessThanOrEqual(95);
    expect(res.address).toBe(ADDR);
  });

  it('is deterministic', () => {
    const a = computeScore(ADDR);
    const b = computeScore(ADDR);
    expect(a.score).toBe(b.score);
    expect(a.dimensions).toEqual(b.dimensions);
    expect(a.passport).toBe(b.passport);
  });

  it('includes all 7 dimensions', () => {
    const res = computeScore(ADDR);
    const expected = ['TX_VOLUME', 'COUNTERPARTY_DIV', 'ACCOUNT_AGE', 'REPAYMENT_HIST',
      'EXPLOIT_EXPOSURE', 'PROMPT_INTEGRITY', 'PEER_ENDORSEMENT'];
    for (const d of expected) {
      expect(res.dimensions).toHaveProperty(d);
      expect(res.dimensions[d as keyof typeof res.dimensions]).toBeGreaterThanOrEqual(55);
    }
  });

  it('verdict matches score', () => {
    const res = computeScore(ADDR);
    if (res.score >= 85) expect(res.verdict).toBe('TRUSTED_AGENT');
    else if (res.score >= 65) expect(res.verdict).toBe('REVIEW_ADVISED');
    else expect(res.verdict).toBe('HIGH_RISK');
  });

  it('passport is a valid hex string', () => {
    const res = computeScore(ADDR);
    expect(res.passport).toMatch(/^0x[0-9a-f]{40}$/);
  });
});

describe('computeVerify()', () => {
  it('returns valid passport and address', () => {
    const res = computeVerify(ADDR);
    expect(res.passport).toMatch(/^0x[0-9a-f]{40}$/);
    expect(res.address).toBe(ADDR);
    expect(typeof res.verified).toBe('boolean');
  });

  it('is deterministic', () => {
    const a = computeVerify(ADDR);
    const b = computeVerify(ADDR);
    expect(a.verified).toBe(b.verified);
    expect(a.passport).toBe(b.passport);
  });

  it('registered_at is null when not verified', async () => {
    const { createHash } = await import('node:crypto');
    let found = false;
    for (let i = 0; i < 100 && !found; i++) {
      const addr = `0x${createHash('sha256').update(i.toString()).digest('hex').slice(0, 40)}`;
      const res = computeVerify(addr);
      if (!res.verified) {
        expect(res.registered_at).toBeNull();
        found = true;
      }
    }
  });
});
