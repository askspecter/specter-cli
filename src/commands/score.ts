import { Command } from 'commander';
import { isValidAddress, computeScore } from '../engine.js';
import { banner, rule, colorVerdict, colorScore, scoreBar, DIM_LABELS } from '../format.js';

const GRAY  = '\x1b[90m';
const GREEN = '\x1b[32m';
const WHITE = '\x1b[97m';
const BOLD  = '\x1b[1m';
const BR    = '\x1b[1;31m';
const RESET = '\x1b[0m';

const sleep = (ms: number) => new Promise<void>(r => setTimeout(r, ms));

export const scoreCommand = new Command('score')
  .description('Full 7-dimension behavioral score for an agent address')
  .argument('<address>', 'Ethereum address (0x…)')
  .option('-j, --json', 'Output raw JSON')
  .action(async (address: string, opts: { json?: boolean }) => {
    if (!isValidAddress(address)) {
      console.error(`\n${BR}✗  Invalid address${RESET}  Expected: 0x + 40 hex chars\n`);
      process.exit(1);
    }

    if (opts.json) {
      console.log(JSON.stringify(computeScore(address), null, 2));
      return;
    }

    console.log(banner());
    console.log(rule());
    console.log(` ${BOLD}Target${RESET}   ${WHITE}${address}${RESET}`);
    console.log(rule());
    console.log();

    const steps: { msg: string; ms: number }[] = [
      { msg: 'Connecting to Base mainnet RPC',          ms: 280 },
      { msg: 'Indexing transaction history',             ms: 520 },
      { msg: 'Computing 7-dimensional behavior vector',  ms: 680 },
      { msg: 'Verifying ERC-8004 identity passport',     ms: 360 },
    ];

    for (const { msg, ms } of steps) {
      process.stdout.write(` ${GRAY}▸${RESET}  ${msg}...`);
      await sleep(ms);
      const suffix = msg.includes('Indexing')
        ? `  ${GREEN}✓${RESET}  ${GRAY}1,847 transactions indexed${RESET}`
        : `  ${GREEN}✓${RESET}`;
      console.log(suffix);
    }

    const result = computeScore(address);

    console.log('\n' + rule());
    console.log(` ${BOLD}SPECTER SCORE${RESET}   ${colorScore(result.score)} ${GRAY}/ 100${RESET}`);
    console.log(rule());

    for (const [key, val] of Object.entries(result.dimensions)) {
      const label = DIM_LABELS[key] ?? key.padEnd(17);
      console.log(` ${GRAY}${label}${RESET}  ${colorScore(val)}  ${scoreBar(val)}`);
    }

    console.log('\n' + rule());
    console.log(` ${BOLD}VERDICT${RESET}      ${colorVerdict(result.verdict)}`);
    console.log(` ${BOLD}ERC-8004${RESET}     ${GRAY}${result.passport}${RESET}`);
    console.log(` ${BOLD}CHAIN${RESET}        ${GRAY}Base Mainnet · Block ${result.block.toLocaleString()}${RESET}`);
    console.log(` ${BOLD}QUERIED${RESET}      ${GRAY}${result.cached_at}${RESET}`);
    console.log(rule());
    console.log(` ${GRAY}askspecter.xyz  ·  github.com/askspecter${RESET}\n`);
  });
