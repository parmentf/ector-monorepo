# `@ector/samples`

A package of different ECTOR's backups.

## Usage

```js
const samples = require('@ector/samples');

// List all samples
console.log(Object.keys(samples));
```

Otherwise, you can just install it, and use it with [@ector/cli](../cli):

```bash
npm i @ector/samples
npx @ector/cli use en-bot
```

## Samples

- `en-bot`: few sentences about ECTOR and chatterbots, in English
- `fr-bot`: few sentences about ECTOR and chatterbots, in French

## Contribution

Simply write a text, save it into a file, place it in
`lib/{lang}-{subject}.txt`, where `lang` is a two-letters language code, and
`subject` is the subject.

Next, use [@ector/cli](../cli) to create the JSON file:

```bash
node packages/cli/bin/cli reset
node packages/cli/bin/cli setbot ECTOR
node packages/cli/bin/cli learn < packages/samples/lib/{lang}-{subject}.txt
cp ector.json packages/samples/lib/ector.{lang}-{subject}.json
```

Don't forget to declare it in the `packages/samples/lib/samples.js` file.

Ultimately, add the name and the description of the file to this `README.md`.
