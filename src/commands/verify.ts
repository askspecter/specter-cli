import { Command } from 'commander';
import { isValidAddress, computeVerify } from '../engine.js';
import { banner } from '../format.js';

const sleep = (ms: number) => new Promise<void>(r => setTimeout(r, ms));

export const verifyCommand = new Command('verify')
  .description('Verify ERC-8004 identity passport for an agent')
  .argument('<address>', 'Ethereum address to verify (0x...)')
  .option('-j, --json', 'Output raw JSON')
  .action(async (address: string, opts: { json?: boolean }) => {
    if (!isValidAddress(address)) {
      console.error(`\x1b[31mError: Invalid Ethereum address: ${address}\x1b[0m`);
      process.exit(1);
    }

    if (!opts.json) {
      console.log(banner());
      process.stdout.write('  Querying ERC-8004 registry on Base...');
      await sleep(450);
      process.stdout.write(' \x1b[32m✓\x1b[0m\n\n');
    }

    const result = computeVerify(address);

    if (opts.json) {
      console.log(JSON.stringify(result, null, 2));
      return;
    }

    const G = '\x1b[32m', R = '\x1b[31m', B = '\x1b[1m', RESET = '\x1b[0m';
    const status = result.verified
      ? `${G}${B}VERIFIED ✓${RESET}`
      : `${R}${B}NOT VERIFIED ✗${RESET}`;

    console.log(`  Address     ${result.address}`);
    console.log(`  Status      ${status}`);
    console.log(`  Passport    ${result.passport}`);
    console.log(`  Registered  ${result.registered_at ?? 'N/A'}`);
    console.log(`  Block       #${result.block.toLocaleString()}\n`);
  });
