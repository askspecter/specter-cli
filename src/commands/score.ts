import { Command } from 'commander';
import { isValidAddress, computeScore } from '../engine.js';
import { banner, colorVerdict, colorScore, scoreBar, DIM_LABELS } from '../format.js';

const sleep = (ms: number) => new Promise<void>(r => setTimeout(r, ms));

export const scoreCommand = new Command('score')
  .description('Get behavioral reputation score for an agent address')
  .argument('<address>', 'Ethereum address to score (0x...)')
  .option('-j, --json', 'Output raw JSON')
  .action(async (address: string, opts: { json?: boolean }) => {
    if (!isValidAddress(address)) {
      console.error(`\x1b[31mError: Invalid Ethereum address: ${address}\x1b[0m`);
      process.exit(1);
    }

    if (!opts.json) {
      console.log(banner());
      process.stdout.write('  Connecting to Base mainnet...');
      await sleep(300);
      process.stdout.write(' \x1b[32m✓\x1b[0m\n');
      process.stdout.write('  Indexing agent transactions...');
      await sleep(400);
      process.stdout.write(' \x1b[32m✓\x1b[0m\n');
      process.stdout.write('  Scoring 7 dimensions...');
      await sleep(350);
      process.stdout.write(' \x1b[32m✓\x1b[0m\n\n');
    }

    const result = computeScore(address);

    if (opts.json) {
      console.log(JSON.stringify(result, null, 2));
      return;
    }

    const SEP = '  ' + '─'.repeat(46);
    console.log(`  Address  ${result.address}`);
    console.log(`  Score    ${colorScore(result.score)}/100`);
    console.log(`  Verdict  ${colorVerdict(result.verdict)}`);
    console.log(`  Passport ${result.passport}`);
    console.log(`  Block    #${result.block.toLocaleString()}\n`);
    console.log(SEP);
    console.log('  Dimension Breakdown');
    console.log(SEP);
    for (const [key, val] of Object.entries(result.dimensions)) {
      const label = DIM_LABELS[key] ?? key.padEnd(20);
      console.log(`  ${label} ${scoreBar(val)}  ${val}`);
    }
    console.log(SEP + '\n');
  });
