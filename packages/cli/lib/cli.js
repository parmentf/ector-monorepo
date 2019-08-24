'use strict';

// const ECTOR = require('@ector/core');
const yargs = require('yargs/yargs');

/**
 * Main function of the Command Line Interface
 * @param {string} cwd  The current working directory path
 */
const cli = function cli(cwd) {
    let ector = {};
    return yargs()
        .pkgConf('', cwd)
        .scriptName('ector')
        .alias('h', '--help')
        .alias('V', '--version')
        .help()
        .command('setuser <username>', 'set username', () => {}, ({ username }) => {
            console.log(`New username: "${username}"`);
        })
        .command('setbot <botname>', 'set botname', () => {}, ({ botname }) => {
            console.log(`New botname: "${botname}"`);
        })
        .command('reply [entry..]', 'make ECTOR reply', () => {}, ({ entry }) => {
            console.log('Entry:', entry.join(' '));
        })
        .command('save [file]', 'save ECTOR state', (yargs) => {
            yargs.positional('file', {
                describe: 'file name',
                default: './ector.json'
            });
        }, ({ file }) => {
            console.log('File:', file);
        })
        .command('load [file]', 'load ECTOR from a file', (yargs) => {
            yargs.positional('file', {
                describe: 'file name',
                default: './ector.json'
            })
        }, ({ file }) => {
            console.log('Load from', file);
        })
        ;
};

module.exports = cli;
