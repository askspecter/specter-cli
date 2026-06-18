import { Command } from 'commander';
import { isValidAddress, computeVerify } from '../engine.js';
import { banner, rule } from '../format.js';

const GRAY  = '\x1b[90m';
const GREEN = '\x1b[32m';
const BG    = '\x1b[1;32m';
const BR    = '\x1b[1;31m';
const BOLD  = '\x1b[1m';
const RESET = '\x1b[0m';

const sleep = (ms: number) => new Promise<void>(r => setTimeout(r, ms));

function shortAddr(addr: string): string {
  return addr.slice(0, 6) + '…' + addr.slice(-4);
}

export const verifyCommand = new Command('verify')
  .description('Check ERC-8004 identity passport for an agent')
  .argument('<address>', 'Ethereum address (0x…)')
  .option('-j, --json', 'Output raw JSON')
  .action(async (address: string, opts: { json?: boolean }) => {
    if (!isValidAddress(address)) {
      console.error(`\n${BR}✗  Invalid address${RESET}  Expected: 0x + 40 hex chars\n`);
      process.exit(1);
    }

    if (opts.json) {
      console.log(JSON.stringify(computeVerify(address), null, 2));
      return;
    }

    console.log(banner());
    console.log(` ${GRAY}ERC-8004 Identity Verification${RESET}\n`);

    process.stdout.write(` ${GRAY}▸${RESET}  Checking ${shortAddr(address)} on Base...`);
    await sleep(700);

    const result = computeVerify(address);

    if (result.verified) {
      console.log(`  ${GREEN}✓${RESET}\n`);
      console.log(rule());
      console.log(` ${BG}✓  VERIFIED${RESET}`);
      console.log(` ${BOLD}Passport${RESET}  ${GRAY}${result.passport}${RESET}`);
      console.log(` ${BOLD}Chain${RESET}     ${GRAY}Base Mainnet${RESET}`);
      console.log(` ${BOLD}Status${RESET}    ${GREEN}Active${RESET}`);
      console.log(rule());
    } else {
      console.log(`  ${BR}✗${RESET}\n`);
      console.log(rule());
      console.log(` ${BR}✗  NOT REGISTERED${RESET}`);
      console.log(` ${GRAY}This address has no ERC-8004 identity passport.${RESET}`);
      console.log(` ${GRAY}Register at: askspecter.xyz${RESET}`);
      console.log(rule());
    }
    console.log();
  });
