'use strict';

const yargs = require('yargs/yargs');
const cli = function cli(cwd) {
  const parser = yargs(null, cwd);

  parser.alias('h', 'help');
  parser.alias('v', 'version');

  parser.usage(
    "$0",
    "TODO: description",
    yargs => {
      yargs.options({
        // TODO: options
      });
    },
    argv => cli(argv)
  );

  return parser;
}

module.exports = cli;