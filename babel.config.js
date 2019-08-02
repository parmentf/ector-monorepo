'use strict'

module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current',
        },
        useBuiltIns: 'usage',
        loose: true,
      },
    ],
  ],
  plugins: [
    '@babel/plugin-transform-modules-commonjs',
  ],
}
