'use strict';

import Tokenizer from 'sentence-tokenizer';
import { ConceptNetwork, addLink, addNode, incrementBeginning, incrementEnd, incrementMiddle } from '@ector/concept-network';
import { ConceptNetworkState, activate } from '@ector/state';

/**
 * @typedef {Object<string, any>} ECTOR
 * @property {string}   [name="ECTOR"]      name of the bot
 * @property {string}   [username="Guy"]    name of the user
 * @property {ConceptNetwork}   [cn]
 * @property {Object<string, ConceptNetworkState>}  [cns]   One state per
 *                                                          username
 * @property {string}   [lastSentenceLabel] Label of the last entry first sentence
 * @property {string[]} [lastTokenLabels]   Labels of the last entry tokens
 */

/**
 * Add an entry to ector's model.
 *
 * @export
 * @param {ECTOR} ector
 * @param {string} entry
 * @returns {ECTOR|Error}
 */
export function addEntry(ector, entry) {
    if (!entry) return new Error('addEntry: No entry given!');

    const name = ector.name || 'ECTOR';
    const username = ector.username || 'Guy';
    let cn = ector.cn || {};
    let cns = ector.cns || {};
    let state = cns[username] || {};
    cns = { ...cns, [username]: state };

    const tokenizer = new Tokenizer(username, name);
    tokenizer.setEntry(entry);
    const sentences = tokenizer.getSentences();
    let prevSentenceLabel;
    let lastSentenceLabel = ector.lastSentenceLabel;

    const lastTokenLabels = sentences.reduce(
        (labels, sentence, sentenceIndex) => {
            const sentenceLabel = `s${sentence}`;
            cn = addNode(cn, sentenceLabel);
            if (prevSentenceLabel) {
                cn = addLink(cn, prevSentenceLabel, sentenceLabel);
            }
            if (sentenceIndex === 0) {
                lastSentenceLabel = sentenceLabel;
            }
            state = activate(state, sentenceLabel);

            const tokens = tokenizer.getTokens(sentenceIndex);
            const { tokenLabels } = tokens.reduce(
                ({ tokenLabels, prevTokenLabel }, token, tokenIndex) => {
                    const tokenLabel = `w${token}`;
                    cn = addNode(cn, tokenLabel);
                    state = activate(state, tokenLabel);

                    // add position in sentence (beg, mid, end)
                    if (tokenIndex === 0) {
                        cn = incrementBeginning(cn, tokenLabel);
                    }
                    if (tokenIndex !== 0 && tokenIndex < tokens.length - 1) {
                        cn = incrementMiddle(cn, tokenLabel);
                    }
                    if (tokenIndex === tokens.length - 1) {
                        cn = incrementEnd(cn, tokenLabel);
                    }

                    cn = addLink(cn, sentenceLabel, tokenLabel);
                    if (prevTokenLabel) {
                        cn = addLink(cn, prevTokenLabel, tokenLabel);
                    }
                    prevTokenLabel = tokenLabel;
                    return { tokenLabels: [...tokenLabels, tokenLabel], prevTokenLabel };
                },
                { tokenLabels: [], prevTokenLabel: null },
            );
            return [...labels, ...tokenLabels];
        },
        [],
    );

    cns[username] = state;
    const newEctor = {
        ...ector,
        name,
        username,
        cn,
        cns,
        lastSentenceLabel,
        lastTokenLabels,
    };
    return Object.freeze(newEctor);
}

export function generateResponse(ector) {}

export function getResponse(ector) {}
