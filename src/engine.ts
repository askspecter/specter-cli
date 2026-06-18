import { createHash } from 'node:crypto';

export type ScoreVerdict = 'TRUSTED_AGENT' | 'REVIEW_ADVISED' | 'HIGH_RISK';

export interface ScoreDimensions {
  TX_VOLUME: number;
  COUNTERPARTY_DIV: number;
  ACCOUNT_AGE: number;
  REPAYMENT_HIST: number;
  EXPLOIT_EXPOSURE: number;
  PROMPT_INTEGRITY: number;
  PEER_ENDORSEMENT: number;
}

export interface ScoreResult {
  address: string;
  score: number;
  verdict: ScoreVerdict;
  dimensions: ScoreDimensions;
  passport: string;
  block: number;
  cached_at: string;
}

export interface VerifyResult {
  address: string;
  verified: boolean;
  passport: string;
  registered_at: string | null;
  block: number;
}

const ADDRESS_RE = /^0x[0-9a-fA-F]{40}$/;

const DIMS: (keyof ScoreDimensions)[] = [
  'TX_VOLUME', 'COUNTERPARTY_DIV', 'ACCOUNT_AGE', 'REPAYMENT_HIST',
  'EXPLOIT_EXPOSURE', 'PROMPT_INTEGRITY', 'PEER_ENDORSEMENT',
];

function dimScore(address: string, key: string): number {
  const hex = createHash('sha256')
    .update(`${address.toLowerCase()}-${key}`)
    .digest('hex');
  return 55 + (parseInt(hex.slice(0, 8), 16) % 41);
}

export function isValidAddress(address: string): boolean {
  return ADDRESS_RE.test(address);
}

export function computeScore(address: string): ScoreResult {
  const dimensions = Object.fromEntries(
    DIMS.map(d => [d, dimScore(address, d)]),
  ) as ScoreDimensions;

  const score = Math.round(
    Object.values(dimensions).reduce((a, b) => a + b, 0) / DIMS.length,
  );

  const verdict: ScoreVerdict =
    score >= 85 ? 'TRUSTED_AGENT' : score >= 65 ? 'REVIEW_ADVISED' : 'HIGH_RISK';

  return {
    address,
    score,
    verdict,
    dimensions,
    passport: `0x${createHash('sha256').update(address.toLowerCase()).digest('hex').slice(0, 40)}`,
    block: 21_847_392,
    cached_at: new Date().toISOString(),
  };
}

export function computeVerify(address: string): VerifyResult {
  const hex = createHash('sha256').update(address.toLowerCase()).digest('hex');
  const verified = parseInt(hex.slice(0, 2), 16) > 64;
  return {
    address,
    verified,
    passport: `0x${hex.slice(0, 40)}`,
    registered_at: verified ? new Date(Date.now() - 30 * 86_400_000).toISOString() : null,
    block: 21_847_392,
  };
}
