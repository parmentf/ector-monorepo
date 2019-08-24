'use strict';

import rwc from 'random-weighted-choice';
import Tokenizer from 'sentence-tokenizer';
import { ConceptNetwork, addLink, addNode, incrementBeginning, incrementEnd, incrementMiddle, getLinksFrom, getLinksTo, getNodeIndex } from '@ector/concept-network';
import { ConceptNetworkState, activate, propagate, getActivationValue } from '@ector/state';

/**
 * @typedef {Object<string, any>} ECTOR
 * @property {string}   [name="ECTOR"]      name of the bot
 * @property {string}   [username="Guy"]    name of the user
 * @property {ConceptNetwork}   [cn]
 * @property {Object<string, ConceptNetworkState>}  [cns]   One state per
 *                                                          username
 * @property {string}   [lastSentenceLabel] Label of the last entry first sentence
 * @property {string[]} [lastTokenLabels]   Labels of the last entry tokens
 * @property {string}   [response]          Generated response
 * @property {string[]} [responseLabels]    Nodes of the response
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

/**
 * Chose one token label from the activated ones.
 *
 * @param {ConceptNetworkState} state
 * @param {number}              temperature
 * @returns {string}    The chosen token
 */
function choseToken(state, temperature) {
    // Warning:  there is a getMaxActivationValue function in @ector/state
    const maxActivationValue = Object.keys(state)
        .filter(label => label.startsWith('w'))
        .reduce((max, label) => Math.max(state[label].value, max), 0);
    // Warning, there is a getActivatedTypedNodes function in @ector/state
    const tokens = Object.keys(state)
        .filter(label => label.startsWith('w'))
        .filter(label => state[label].value >= maxActivationValue - 10);
    const toChoose = tokens.map(label => ({ weight: state[label].value, id: label }));
    const chosenNode = rwc(toChoose, temperature);
    return chosenNode;
}

/**
   * Generate the end of a sentence, adding tokens to the list of token
   * nodes in phrase.
   *
   * @param {ConceptNetwork}        cn          Network of tokens
   * @param {ConceptNetworkState}   cns         State of the network (activation values)
   * @param {{ id: string, weight: number }[]}  phraseNodes array of token nodes
   * @param {number}                temperature
   * @returns {{ id: string, weight: number }[]} array of token nodes (end of phrase)
   **/
function generateForwards(cn, cns, phraseNodes, temperature) {
    const outgoingLinks = getLinksFrom(cn, phraseNodes[phraseNodes.length -1].id)

    /** @type Array<{ id: string, weight: number }> */
    const nextNodes = outgoingLinks.reduce((nodes, link) => {
        const toNode = cn.node[link.to];
        // When toNode is a word token
        if (toNode.label.startsWith('w')) {
            const activationValue = Math.max(getActivationValue(cns, toNode.label), 1);
            const repeatNb = phraseNodes.filter( ({ id }) => id === toNode.label).length;
            const len = toNode.label.length;
            // If the node is not present more than ~3 times
            if (repeatNb * len <= 5 * 3) {
                const repetition = 1 + repeatNb * repeatNb * len;
                return [...nodes, {
                    id: toNode.label,
                    weight: link.coOcc * activationValue / repetition
                }];
            }
        }
        return [...nodes];
    }, [])

    // Stop condition
    if (nextNodes.length === 0) {
      return phraseNodes;
    }
    // Choose one node among the tokens following the one at the end of the
    // phrase
    const chosenItem = rwc(nextNodes, temperature);
    const chosenItemIndex = getNodeIndex(cn, chosenItem);
    const chosenTokenNode = { id: cn.node[chosenItemIndex].label, weight: -1 };

    // Recursively generate the remaining of the phrase
    return generateForwards(cn, cns, [...phraseNodes, chosenTokenNode], temperature);
}

/**
 * Generate the begining of a sentence, adding tokens to the list of token
 * nodes in phrase.
 *
   * @param {ConceptNetwork}        cn          Network of tokens
   * @param {ConceptNetworkState}   cns         State of the network (activation values)
   * @param {{ id: string, weight: number }[]}  phraseNodes array of token nodes
   * @param {number}                temperature
   * @returns {{ id: string, weight: number }[]} array of token nodes (end of phrase)
 **/
function generateBackwards(cn, cns, phraseNodes, temperature) {
    const incomingLinks = getLinksTo(cn, phraseNodes[0].id)
    /** @type Array<{ id: string, weight: number }> */
    const previousNodes = incomingLinks.reduce((nodes, link) => {
        const fromNode = cn.node[link.from];
        // When fromNode is a word token
        if (fromNode.label.startsWith('w')) {
            const activationValue = Math.max(getActivationValue(cns, fromNode.label), 1);
            const repeatNb = phraseNodes.filter( ({ id }) => id === fromNode.label).length;
            const len = fromNode.label.length;
            // If the node is not present more than ~3 times
            if (repeatNb * len <= 5 * 3) {
                const repetition = 1 + repeatNb * repeatNb * len;
                return [...nodes, {
                    id: fromNode.label,
                    weight: link.coOcc * activationValue / repetition
                }];
            }
        }
        return [...nodes];
    }, []);

    // Stop condition
    if (previousNodes.length === 0) {
      return phraseNodes;
    }
    // Choose one node among the tokens following the one at the end of the
    // phrase
    const chosenItem = rwc(previousNodes, temperature);
    const chosenItemIndex = getNodeIndex(cn, chosenItem);
    const chosenTokenNode = { id: cn.node[chosenItemIndex].label, weight: -1 };

    // Recursively generate the remaining of the phrase
    return generateBackwards(cn, cns, [chosenTokenNode, ...phraseNodes], temperature);
}

/**
 * Generate a response from the activated nodes.
 *
 * @exports
 * @param {ECTOR} ector
 * @returns {ECTOR}
 */
export function generateResponse(ector) {
    const username = ector.username || 'Guy';
    const cn = Object.assign({}, ector.cn);
    let cns = Object.assign({}, ector.cns);
    let state = Object.assign({}, cns[username]);

    state = propagate(ector.cn, state);

    const temperature = 60;
    const initialTokenLabel = choseToken(state, temperature);
    let responseItems = [{ id: initialTokenLabel, weight: 1 }];
    responseItems = generateForwards(cn, state, responseItems, temperature);
    responseItems = generateBackwards(cn, state, responseItems, temperature);
    // remove first character (type of node)
    let response = responseItems.map(({ id }) => id.slice(1)).join(' ');

    response = response.replace(/\{yourname\}/g, username);
    response = response.replace(/\{myname\}/g, ector.name || 'ECTOR');

    cns[username] = state;
    return Object.freeze({
        ...ector,
        cns,
        response,
        responseLabels: responseItems.map(({ id }) => id)
    });
}

/**
 * Link nodes to the previous sentence node label (this is automatically set by
 * addEntry, it is the node label of the first sentence of the entry).
 *
 * Used with the nodes returned by addEntry.
 *
 * @param {ECTOR} ector
 * @param {Array<string>} [nodeLabels=[]] Array of nodes labels.
 * @returns {ECTOR}
 **/
export function linkNodesToLastSentence(ector, nodeLabels = []) {
    const cn = nodeLabels.reduce((cn, nodeLabel) => {
        // QUESTION: is it the right direction(?)
        return addLink(cn, nodeLabel, ector.lastSentenceLabel);
    }, ector.cn)
    return Object.freeze({ ...ector, cn })
}

/**
 * Get the response already generated with generateResponse.
 *
 * @param {ECTOR} ector
 * @returns {string}
 */
export function getResponse(ector) {
    return ector.response || '';
}
