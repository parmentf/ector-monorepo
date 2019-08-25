# `@ector/cli`

Interactive command line interface to ECTOR, the learning chatterbot.

## Usage

```bash
$ npm -g i @ector/cli

$ ector --help

$ ector reply "Hello ECTOR, how do you do?"
Hello Guy, how do you do?
$ ector setuser François
New username: "François"
$ ector reply "My name is now François."
My name is now ECTOR.
$ ector reply "Glad to meet you, ECTOR."
Glad to meet you François.
$ ector reply "I know that your mind is pretty empty, but let's try to fill it."
My name is pretty empty, but let's try to fill it.
$ ector reply "That's because the @ector/cli package does not contain any prepared JSON file containing a mind."
I know that your mind is pretty empty, but let's try to meet you, François.
$ ector reply "You know that you cn look within your mind, ECTOR?"
I know that you cn look within your mind, François?
$ ector reply "You only need fx to be installed."; fx ector.json .response
You know that you cn look within your mind, François?
You know that you cn look within your mind, François?
$ ector reply "That allows us to hear your response and to read it." | espeak --stdin ; fx ector.json .response
You only need fx to read it.
$ ector reply "You have a sweet voice, ECTOR ;)" | espeak --stdin ; fx ector.json .response
You only need fx to read it.
$ ector reply "Of course, to hear your voice, espeak has to be installed too." | espeak --stdin ; fx ector.json .response
Hello François, how do you cn look within your voice, François ;)
$ reply "You have almost the same voice as Stephen Hawking. At least the voice you can hear in The Big Bang Theory." | espeak --stdin ; fx ector.json .response
Of course, to fill it.
```

## Explanation

Every command of `ector` saves it state in the `./ector.json` file.
That allows to copy an entire mind to another file.

At the beginning, ECTOR's mind is empty, you have to fill it.
It learns from what you say to him (using `ector reply` or `ector learn`).
