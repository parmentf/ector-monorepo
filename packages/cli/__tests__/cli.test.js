'use strict';

import { promisify } from 'util';
import fs from 'fs';
import tester from 'cli-tester';
import cli from '../lib/cli';
const { version } = require(`${__dirname}/../package.json`);

const getEctorFileContent = async () => {
    const readFile = promisify(fs.readFile);
    const str = await readFile(`${__dirname}/ector.json`, { encoding: 'utf8' });
    return JSON.parse(str);
};

describe('@ector/cli ector', () => {
    describe('version', () => {
        it('--version should give version', () =>
            tester(require.resolve('../bin/cli'), '--version').then(
                ({ code, stdout, stderr }) => {
                    expect(code).toBe(0);
                    expect(stdout).toBe(version);
                    expect(stderr).toBe('');
                },
            ));

        it('-v should give version', () =>
            tester(require.resolve('../bin/cli'), '-V').then(
                ({ code, stdout, stderr }) => {
                    expect(code).toBe(0);
                    expect(stdout).toBe(version);
                    expect(stderr).toBe('');
                },
            ));
    });

    describe('setuser', () => {
        it('should create a file with the username', () =>
            tester(require.resolve('../bin/cli'), 'setuser', 'Username').then(
                async ({ code, stdout, stderr }) => {
                    expect(code).toBe(0);
                    expect(stdout).toBe('New username: "Username"');
                    expect(stderr).toBe('');
                    const { username } = await getEctorFileContent();
                    expect(username).toBe('Username');
                },
            ));
    });

    describe('setbot', () => {});
    describe('reply', () => {});
    describe('learn', () => {});
    describe('about', () => {});
});
