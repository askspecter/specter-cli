import { Command } from 'commander';
import { isValidAddress, computeScore } from '../engine.js';
import { colorScore, colorVerdict } from '../format.js';

export const watchCommand = new Command('watch')
  .description('Watch an agent address for score changes in real time')
  .argument('<address>', 'Ethereum address to watch (0x...)')
  .option('-i, --interval <ms>', 'Poll interval in milliseconds', '3000')
  .action((address: string, opts: { interval: string }) => {
    if (!isValidAddress(address)) {
      console.error(`\x1b[31mError: Invalid Ethereum address: ${address}\x1b[0m`);
      process.exit(1);
    }

    const interval = Math.max(500, parseInt(opts.interval, 10));
    const DIM = '\x1b[2m', RESET = '\x1b[0m', B = '\x1b[1m', R = '\x1b[31m';

    console.log(`\n${R}${B}SPECTER WATCH${RESET} — ${DIM}${address}${RESET}`);
    console.log(`${DIM}Polling every ${interval}ms. Press Ctrl+C to stop.${RESET}\n`);

    let lastScore = -1;
    let tick = 0;

    const poll = () => {
      const result = computeScore(address);
      const ts = new Date().toLocaleTimeString();
      const changed = lastScore !== -1 && result.score !== lastScore;
      const arrow = changed ? (result.score > lastScore ? ' ↑' : ' ↓') : '  ';

      process.stdout.write(
        `\r  [${ts}] tick=${String(++tick).padStart(4, '0')}  ` +
        `Score: ${colorScore(result.score)}/100  ` +
        `${colorVerdict(result.verdict)}${arrow}   `,
      );
      lastScore = result.score;
    };

    poll();
    const timer = setInterval(poll, interval);

    process.on('SIGINT', () => {
      clearInterval(timer);
      console.log('\n\n  Watch stopped.\n');
      process.exit(0);
    });
  });
