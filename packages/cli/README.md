# `@ector/cli`

Interactive command line interface to ECTOR, the learning chatterbot.

## Usage

```bash
$ npm -g i @ector/cli

$ ector --help
ector [command]

Commandes:
  ector setuser <username>  set username
  ector setbot <botname>    set botname
  ector reply [entry..]     make ECTOR reply
  ector reset               reset ECTOR

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

## Commands

To see all implemented commands, use `ector --help` or `ector -h`.

To know ector's version, use `ector --version` or `ector -V`.

### setuser

Set the name of the user, that is used by ECTOR when replying to you (the user).

Default value: `Guy`.

```bash
ector setuser Chuck
```

### setbot

Set the name of the bot (ECTOR), that is used by the bot to name itself.

Default value: `ECTOR`.

This acronym means **E**ntity **C**ompelled **To** **R**eply.

```bash
ector setbot Achille
```

### reply

Get a reply from ECTOR.

You have to give an entry (which is integrated into ECTOR's mind), so that ECTOR
can reply.

It gives a reply on `stdout` (standard output), and saves its state into
`./ector.json` file.

> **Warning**: it's safer to quote the entry using double quotes `"`.

```bash
$ ector reply "How do you do?"
How do you do?
```

### reset

Remove `./ector.json` file, resetting all ECTOR's state (its name, your name,
what you said, it's remindings of what you last said, ...).

### learn

Learn what you give to ECTOR through its standard input (using the redirection
or pipe).

```bash
$ ector learn < book.txt
Learned.
```

Or (to learn Time machine from H.G.Wells):

```bash
$ curl https://www.gutenberg.org/files/35/35-0.txt | ector learn
Learned.
```
