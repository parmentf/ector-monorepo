'use strict';

const ECTOR = require('@ector/core');
const yargs = require('yargs/yargs');
const readline = require('readline');
const fs = require('fs');
const {
    getEctorFileContent,
    setEctorFileContent,
    removeEctorFile,
} = require('./utils');

/**
 * Main function of the Command Line Interface
 * @param {string} cwd  The current working directory path
 */
const cli = function cli(cwd) {
    /** @type ECTOR.ECTOR */
    let ector = getEctorFileContent();
    return yargs()
        .pkgConf('', cwd)
        .scriptName('ector')
        .alias('h', '--help')
        .alias('V', '--version')
        .help()
        .command(
            'setuser <username>',
            'set username',
            // @ts-ignore
            () => {},
            ({ username }) => {
                setEctorFileContent({ ...ector, username });
                console.log(`New username: "${username}"`);
            },
        )
        .command(
            'setbot <botname>',
            'set botname',
            () => {},
            ({ botname }) => {
                setEctorFileContent({ ...ector, name: botname });
                console.log(`New botname: "${botname}"`);
            },
        )
        .command(
            'reply [entry..]',
            'make ECTOR reply',
            () => {},
            ({ entry }) => {
                const strEntry = entry.join(' ');
                ector = ECTOR.addEntry(ector, strEntry);
                ector = ECTOR.generateResponse(ector);
                const reply = ECTOR.getResponse(ector);
                setEctorFileContent(ector);
                console.log(reply);
            },
        )
        .command(
            'reset',
            'reset ECTOR',
            () => {},
            () => {
                removeEctorFile();
            },
        )
        .command(
            'learn',
            'learn from standard input',
            () => {},
            () => {
                process.stdin.setEncoding('utf8');

                let data = '';
                process.stdin.on('readable', () => {
                    /** @type {string} */
                    let chunk;
                    // Use a loop to make sure we read all available data.
                    while (
                        (chunk = /** @type {string} */ (process.stdin.read())) !==
                        null
                    ) {
                        chunk = chunk
                            .replace(/\r\n/g, ' ')
                            .replace(/\n/g, ' ')
                            .replace(/  /g, '. ');
                        data += chunk;
                    }
                });

                process.stdin.on('end', () => {
                    ector = ECTOR.addEntry(ector, data);
                    ector = { ...ector, cns: {} };
                    setEctorFileContent(ector);
                    process.stdout.write('Learned.');
                });
            },
        )
        .command(
            'about [tokens..]',
            'find sentences about tokens',
            () => {},
            ({ tokens }) => {
                const about = ECTOR.about(ector, tokens.join(' '));
                const res = Object.keys(about.cns['@about']);
                if (res.length === 0) {
                    console.error('Not found.');
                    return;
                }
                console.log(res.map(s => s.slice(1)));
            },
        )
        .command(
            'chat',
            'have a chat with ECTOR',
            () => {},
            () => {
                const rl = readline.createInterface(
                    process.stdin,
                    process.stdout,
                );

                rl.on('line', entry => {
                    ector = ECTOR.addEntry(ector, entry);
                    ector = ECTOR.generateResponse(ector);
                    console.log(ECTOR.getResponse(ector));
                    rl.prompt();
                }).on('close', () => {
                    setEctorFileContent(ector, cwd);
                    process.exit(0);
                });
            },
        )
        .command(
            'use <file>',
            'load another ECTOR file',
            () => {},
            ({ file }) => {
                const isExisting = fs.existsSync(file);
                if (isExisting) {
                    removeEctorFile(cwd);
                    fs.copyFileSync(file, `${cwd}/ector.json`);
                    const { name } = getEctorFileContent(cwd);
                    console.log(`Loaded new ${name}`);
                } else {
                    console.error('${file} not found.');
                }
            },
        );
};

module.exports = cli;
