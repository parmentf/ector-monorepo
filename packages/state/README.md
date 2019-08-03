# `@ector/state`

[![npm version](https://badge.fury.io/js/%40ector%2Fstate.svg)](https://badge.fury.io/js/%40ector%2Fstate)

`@ector/state` allows activation value propagation within a [`@ector/concept-network`](../concept-network).

## Usage

```js
const conceptNetwork = require('@ector/concept-network');
const cns = require('@ector/state');

let cn = conceptNetwork.addNode({}, 'ECTOR');
cn = conceptNetwork.addNode(cn, 'knows');
cn = conceptNetwork.addNode(cn, 'Achille');

cn = conceptNetwork.addLink(cn, 'ECTOR', 'knows');
cn = conceptNetwork.addLink(cn, 'knows', 'Achille');

let cns = cns.activate({}, 'ECTOR');
cns = cnsPropagate(cn, cns);
```

will give

```json
{ ECTOR: { value: 59.500004166625004, age: 1, old: 100 },
  knows: { value: 63.40844023393148, old: 0, age: 0 } }
```

## Functions
