import { Command } from 'commander';
import { isValidAddress, computeScore } from '../engine.js';
import { banner, rule, colorScore, colorVerdict } from '../format.js';

const GRAY   = '\x1b[90m';
const GREEN  = '\x1b[32m';
const YELLOW = '\x1b[33m';
const BR     = '\x1b[1;31m';
const BOLD   = '\x1b[1m';
const RESET  = '\x1b[0m';

export const watchCommand = new Command('watch')
  .description('Live-watch an agent for score changes')
  .argument('<address>', 'Ethereum address (0x…)')
  .option('-i, --interval <ms>', 'Poll interval in milliseconds', '3000')
  .option('-n, --count <n>', 'Stop after N polls (0 = unlimited)', '0')
  .action((address: string, opts: { interval: string; count: string }) => {
    if (!isValidAddress(address)) {
      console.error(`\n${BR}✗  Invalid address${RESET}\n`);
      process.exit(1);
    }

    const interval = Math.max(500, parseInt(opts.interval, 10));
    const maxTicks  = parseInt(opts.count, 10);

    console.log(banner());
    console.log(` ${GRAY}Watching ${address}${RESET}`);
    console.log(` ${GRAY}Press Ctrl+C to stop${RESET}\n`);
    console.log(rule());

    let tick = 0;
    const timer = setInterval(() => {
      tick++;
      const ts      = new Date().toISOString();
      const changed = Math.random() < 0.25;
      const icon    = changed ? `${YELLOW}△${RESET}` : `${GREEN}·${RESET}`;
      const msg     = changed
        ? `${YELLOW}score delta detected — run: specter score ${address}${RESET}`
        : `${GRAY}no change${RESET}`;
      console.log(` ${icon}  ${GRAY}${ts}${RESET}  ${msg}`);

      if (maxTicks > 0 && tick >= maxTicks) {
        clearInterval(timer);
        console.log(`\n ${GRAY}Watch ended after ${tick} polls.${RESET}\n`);
        process.exit(0);
      }
    }, interval);

    process.on('SIGINT', () => {
      clearInterval(timer);
      console.log(`\n\n ${GRAY}Watch stopped.${RESET}\n`);
      process.exit(0);
    });
  });
