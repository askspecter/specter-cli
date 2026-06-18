const R = '\x1b[31m';
const G = '\x1b[32m';
const Y = '\x1b[33m';
const B = '\x1b[1m';
const DIM = '\x1b[2m';
const RESET = '\x1b[0m';

export function colorVerdict(verdict: string): string {
  if (verdict === 'TRUSTED_AGENT') return `${G}${B}${verdict}${RESET}`;
  if (verdict === 'REVIEW_ADVISED') return `${Y}${B}${verdict}${RESET}`;
  return `${R}${B}${verdict}${RESET}`;
}

export function colorScore(score: number): string {
  const color = score >= 85 ? G : score >= 65 ? Y : R;
  return `${color}${B}${score}${RESET}`;
}

export function scoreBar(score: number): string {
  const filled = Math.round(score / 10);
  const color = score >= 85 ? G : score >= 65 ? Y : R;
  return `${color}${'█'.repeat(filled)}${DIM}${'░'.repeat(10 - filled)}${RESET}`;
}

export function banner(): string {
  return [
    ``,
    `  ${R}${B}╔══════════════════════════════════════╗${RESET}`,
    `  ${R}${B}║  ░░  SPECTER PROTOCOL  ░░  v1.0.0   ║${RESET}`,
    `  ${R}${B}║      Know Your Agent · KYA           ║${RESET}`,
    `  ${R}${B}╚══════════════════════════════════════╝${RESET}`,
    ``,
  ].join('\n');
}

export const DIM_LABELS: Record<string, string> = {
  TX_VOLUME:        'Transaction Volume  ',
  COUNTERPARTY_DIV: 'Counterparty Div.   ',
  ACCOUNT_AGE:      'Account Age         ',
  REPAYMENT_HIST:   'Repayment History   ',
  EXPLOIT_EXPOSURE: 'Exploit Exposure    ',
  PROMPT_INTEGRITY: 'Prompt Integrity    ',
  PEER_ENDORSEMENT: 'Peer Endorsement    ',
};
