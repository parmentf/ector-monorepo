# ector-monorepo

[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)
[![CircleCI](https://circleci.com/gh/parmentf/ector-monorepo.svg?style=svg)](https://circleci.com/gh/parmentf/ector-monorepo)

A bunch of ECTOR node packages

## Packages

- [x] [concept-network](./packages/concept-network)
- [x] [state](./packages/state)
- [x] [core](./packages/core)
- [ ] cli
- [ ] backend
- [ ] browser (or svelte)
- [ ] hubot

## Contribution

Use [conventional commits](https://www.conventionalcommits.org/)
(I use [VSCode Commitizen](https://github.com/KnisterPeter/vscode-commitizen)).

### Compilation

```bash
npx lerna build
```

### Test

```bash
npm test
```

### Continuous Integration

Using [CircleCI](https://circleci.com).

See <https://circleci.com/gh/parmentf/ector-monorepo>.

### Publishing

(still to be tested)

Set `GH_TOKEN` to a token from Settings > Developer settings > Personal access tokens.

```bash
npx lerna version --exact --conventional-commits
npx lerna publish from-package
```
