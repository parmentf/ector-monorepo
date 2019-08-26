'use strict';

import tester from 'cli-tester';
const { version } = require(`${__dirname}/../package.json`);
import { getEctorFileContent, removeEctorFile } from '../lib/utils';
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

    // These tests should follow the learn tests
    describe('about', () => {
        it('should give a sentence', () =>
            tester(require.resolve('../bin/cli'), 'about', 'keywords.').then(
                ({ code, stdout, stderr }) => {
                    expect(code).toBe(0);
                    expect(stdout).toBe("[ 'keywords.' ]");
                    expect(stderr).toBe('');
                },
            ));

        it('should give nothing when no sentence match', () =>
            tester(require.resolve('../bin/cli'), 'about', 'nothing').then(
                ({ code, stdout, stderr }) => {
                    expect(code).toBe(0);
                    expect(stdout).toBe('');
                    expect(stderr).toBe('Not found.');
                },
            ));
    });

    describe('chat', () => {
        it('should answer and save', () => {
            const strCommand = require.resolve('../bin/cli') + ' chat';
            const result = execSync(strCommand, {
                input: 'How do you do?',
                encoding: 'utf8',
            });
            expect(result).toBe('How do you do?\n> ');
            const { response } = getEctorFileContent();
            expect(response).toBe('How do you do?');
        });
    });

    describe('use', () => {
        afterAll(() => {
            removeEctorFile();
        });

        it('should load a JSON file', () =>
            tester(
                require.resolve('../bin/cli'),
                'use',
                require.resolve('../../samples/lib/ector.en-bot.json'),
            ).then(({ code, stdout, stderr }) => {
                expect(code).toBe(0);
                expect(stdout).toBe('Loaded new ECTOR');
                expect(stderr).toBe('');
            }));

        it('should not load an unexisting JSON', () =>
            tester(
                require.resolve('../bin/cli'),
                'use',
                './foo.json',
            ).then(({ code, stdout, stderr }) => {
                expect(code).toBe(0);
                expect(stdout).toBe('');
                expect(stderr).toBe('./foo.json not found.');
            }));
    });
});
