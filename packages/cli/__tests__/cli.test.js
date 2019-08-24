'use strict';

const tester = require('cli-tester');
const { version } = require(`${__dirname}/../package.json`);

describe('@ector/cli ector', () => {
  describe('version', () => {
    it('--version should give version', () =>
      tester(require.resolve('../bin/cli'), '--version')
        .then(({ code, stdout, stderr }) => {
          expect(code).toBe(0);
          expect(stdout).toBe(version);
          expect(stderr).toBe('');
        })
    );

    it('-v should give version', () =>
      tester(require.resolve('../bin/cli'), '-V')
        .then(({ code, stdout, stderr }) => {
          expect(code).toBe(0);
          expect(stdout).toBe(version);
          expect(stderr).toBe('');
        })
    );
  });
});
