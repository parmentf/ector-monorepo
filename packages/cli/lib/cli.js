'use strict';

const yargs = require('yargs/yargs');

/**
 * Main function of the Command Line Interface
 * @param {string} cwd  The current working directory path
 */
const cli = function cli(cwd) {
  const parser = yargs(null, cwd);

  parser.alias('h', 'help');
  parser.alias('v', 'version');

  parser.usage(
    "$0",
    // @ts-ignore
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
