'use strict';

const fs = require('fs');
const cwd = process.cwd();

/**
 * Get ./ector.json file content
 *
 * @export
 * @param {string} [directory="current working directory"]
 * @returns Object
 */
module.exports.getEctorFileContent = function(directory = cwd) {
    let str;
    try {
        str = fs.readFileSync(`${directory}/ector.json`, { encoding: 'utf8' });
        return JSON.parse(str);
    } catch (e) {
        return {};
    }
};

/**
 * Set ./ector.json file content
 *
 * @export
 * @param {Object}  ector
 * @param {string} [directory="current working directory"]
 */
module.exports.setEctorFileContent = function(ector, directory = cwd) {
    const str = JSON.stringify(ector, null, 2);
    fs.writeFileSync(`${directory}/ector.json`, str, { encoding: 'utf8' });
};

/**
 * Remove ./ector.json file
 * @param {string} [directory="current working directory"]
 */
module.exports.removeEctorFile = function(directory = cwd) {
    const ectorFilePath = `${directory}/ector.json`;
    if (fs.existsSync(ectorFilePath)) {
        fs.unlinkSync(ectorFilePath);
    }
};
