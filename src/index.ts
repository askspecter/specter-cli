import { Command } from 'commander';
import { scoreCommand }  from './commands/score.js';
import { verifyCommand } from './commands/verify.js';
import { watchCommand }  from './commands/watch.js';
import { banner, rule }  from './format.js';

const GRAY  = '\x1b[90m';
const WHITE = '\x1b[97m';
const BOLD  = '\x1b[1m';
const BR    = '\x1b[1;31m';
const BG    = '\x1b[1;32m';
const Y     = '\x1b[33m';
const RESET = '\x1b[0m';

const program = new Command();

program
  .name('specter')
  .description('SPECTER — Know Your Agent behavioral reputation scoring')
  .version('1.0.0', '-v, --version')
  .addHelpText('beforeAll', banner())
  .addHelpText('after', `
 ${BOLD}SCORE BANDS${RESET}

   ${BG}85–100${RESET}  Trusted Agent
   ${Y}65–84${RESET}   Review Advised
   ${BR}0–64${RESET}    High Risk

 ${GRAY}askspecter.xyz  ·  github.com/askspecter${RESET}
`);

program.addCommand(scoreCommand);
program.addCommand(verifyCommand);
program.addCommand(watchCommand);

program.configureOutput({
  outputError: (str, write) => write(`\n${BR}${str.trim()}${RESET}  Try: specter --help\n\n`),
});

program.parse();
