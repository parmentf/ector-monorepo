'use strict';

const ECTOR = require('@ector/core');
const yargs = require('yargs/yargs');
const { getEctorFileContent, setEctorFileContent, removeEctorFile } = require('./utils');

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
        .command('reset', 'reset ECTOR', () => {}, () => {
            removeEctorFile();
        })
        .command(
            'save [file]',
            'save ECTOR state',
            yargs => {
                yargs.positional('file', {
                    describe: 'file name',
                    default: './ector.json',
                });
            },
            ({ file }) => {
                console.log('File:', file);
            },
        )
        .command(
            'load [file]',
            'load ECTOR from a file',
            yargs => {
                yargs.positional('file', {
                    describe: 'file name',
                    default: './ector.json',
                });
            },
            ({ file }) => {
                console.log('Load from', file);
            },
        );
};

module.exports = cli;
