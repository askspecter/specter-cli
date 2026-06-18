const BR    = '\x1b[1;31m'; // bold bright red
const R     = '\x1b[31m';
const BG    = '\x1b[1;32m'; // bold bright green
const G     = '\x1b[32m';
const Y     = '\x1b[33m';
const GRAY  = '\x1b[90m';
const WHITE = '\x1b[97m';
const BOLD  = '\x1b[1m';
const RESET = '\x1b[0m';

const LOGO = [
  '',
  `${BR} ███████╗██████╗ ███████╗ ██████╗████████╗███████╗██████╗ ${RESET}`,
  `${BR} ██╔════╝██╔══██╗██╔════╝██╔════╝╚══██╔══╝██╔════╝██╔══██╗${RESET}`,
  `${BR} ███████╗██████╔╝█████╗  ██║        ██║   █████╗  ██████╔╝${RESET}`,
  `${BR} ╚════██║██╔═══╝ ██╔══╝  ██║        ██║   ██╔══╝  ██╔══██╗${RESET}`,
  `${BR} ███████║██║     ███████╗╚██████╗   ██║   ███████╗██║  ██║${RESET}`,
  `${BR} ╚══════╝╚═╝     ╚══════╝ ╚═════╝   ╚═╝   ╚══════╝╚═╝  ╚═╝${RESET}`,
  '',
].join('\n');

export function banner(): string {
  return LOGO + ` ${GRAY}Know Your Agent  ·  ERC-8004  ·  v1.0.0${RESET}\n`;
}

export function rule(len = 58): string {
  return GRAY + '─'.repeat(len) + RESET;
}

export function colorVerdict(verdict: string): string {
  if (verdict === 'TRUSTED_AGENT')   return `${BG}TRUSTED AGENT${RESET}`;
  if (verdict === 'REVIEW_ADVISED')  return `${Y}${BOLD}REVIEW ADVISED${RESET}`;
  return `${BR}HIGH RISK${RESET}`;
}

export function colorScore(score: number): string {
  if (score >= 85) return `${BG}${score}${RESET}`;
  if (score >= 65) return `${Y}${BOLD}${score}${RESET}`;
  return `${BR}${score}${RESET}`;
}

export function scoreBar(score: number): string {
  const filled = Math.round(score / 5);
  return R + '█'.repeat(filled) + GRAY + '░'.repeat(20 - filled) + RESET;
}

export const DIM_LABELS: Record<string, string> = {
  TX_VOLUME:        'TX_VOLUME        ',
  COUNTERPARTY_DIV: 'COUNTERPARTY_DIV ',
  ACCOUNT_AGE:      'ACCOUNT_AGE      ',
  REPAYMENT_HIST:   'REPAYMENT_HIST   ',
  EXPLOIT_EXPOSURE: 'EXPLOIT_EXPOSURE ',
  PROMPT_INTEGRITY: 'PROMPT_INTEGRITY ',
  PEER_ENDORSEMENT: 'PEER_ENDORSEMENT ',
};
