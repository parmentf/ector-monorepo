'use strict';

import tester from 'cli-tester';
const { version } = require(`${__dirname}/../package.json`);
import { getEctorFileContent } from '../lib/utils';
import { execSync } from 'child_process';

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
                ({ code, stdout, stderr }) => {
                    expect(code).toBe(0);
                    expect(stdout).toBe('New username: "Username"');
                    expect(stderr).toBe('');
                    const { username } = getEctorFileContent();
                    expect(username).toBe('Username');
                },
            ));
    });

    describe('setbot', () => {
        it('should create a file with the botname', () =>
            tester(require.resolve('../bin/cli'), 'setbot', 'Botname').then(
                ({ code, stdout, stderr }) => {
                    expect(code).toBe(0);
                    expect(stdout).toBe('New botname: "Botname"');
                    expect(stderr).toBe('');
                    const { name } = getEctorFileContent();
                    expect(name).toBe('Botname');
                },
            ));
    });

    describe('reply', () => {
        it('should reply', () =>
            tester(require.resolve('../bin/cli'), 'reply', 'Hello.').then(
                ({ code, stdout, stderr }) => {
                    expect(code).toBe(0);
                    expect(stdout).toBe('Hello.');
                    expect(stderr).toBe('');
                    const { response } = getEctorFileContent();
                    expect(response).toBe('Hello.');
                },
            ));

        it('should generate a long reply', () =>
            tester(
                require.resolve('../bin/cli'),
                'reply',
                'Hello Botname, how are you?',
            ).then(({ code, stdout, stderr }) => {
                expect(code).toBe(0);
                expect(stdout).toBe('Hello Username, how are you?');
                expect(stderr).toBe('');
                const { response } = getEctorFileContent();
                expect(response).toBe('Hello Username, how are you?');
            }));
    });

    describe('reset', () => {
        it('should give an empty ECTOR', () =>
            tester(require.resolve('../bin/cli'), 'reset').then(
                ({ code, stdout, stderr }) => {
                    expect(code).toBe(0);
                    expect(stdout).toBe('');
                    expect(stderr).toBe('');
                    const fileContent = getEctorFileContent();
                    expect(fileContent).toStrictEqual({});
                },
            ));
    });

    // This test should be placed right after reset tests
    describe('learn', () => {
        it('should add nodes in concept network', () => {
            const strCommand =
                require.resolve('../bin/cli') +
                ' learn < ' +
                __dirname +
                '/toLearn.txt';
            const result = execSync(strCommand, {
                input: 'To learn.',
                encoding: 'utf8',
            });
            expect(result).toBe('Learned.');
            const fileContent = getEctorFileContent();
            expect(fileContent).toHaveProperty('cn');
            expect(fileContent.cn).toHaveProperty('node');
            expect(fileContent.cn.node.length).toBeGreaterThan(0);
        });
    });
    describe('about', () => {});
    describe('chat', () => {});
});
