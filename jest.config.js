const { defaults } = require('jest-config');

module.exports = {
    ...defaults,
    coveragePathIgnorePatterns: ['/node_modules/', '/dist/', '/cli/']
};
