'use strict';

const fs = require('fs');

/**
 * Get ./ector.json file content
 *
 * @export
 * @returns Object
 */
module.exports.getEctorFileContent = function() {
    let str;
    try {
        str = fs.readFileSync(`${__dirname}/ector.json`, { encoding: 'utf8' });
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
 */
module.exports.setEctorFileContent = function(ector) {
    const str = JSON.stringify(ector, null, 2);
    fs.writeFileSync(`${__dirname}/ector.json`, str, { encoding: 'utf8' });
};
