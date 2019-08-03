'use strict';

/**
 * @typedef {Object<string, ConceptNetworkNodeState>} ConceptNetworkState
 */

/**
 * @typedef {Object<string, any>} ConceptNetworkNodeState
 * @property {number} value Node's activation value
 * @property {number} [old] Node's old activation value
 * @property {number} [age] Number of propagations
 */

/**
 * Activate the node which `label` is given
 *
 * @export
 * @param {ConceptNetworkState} cns
 * @param {string}              label
 * @returns {ConceptNetworkState}
 */
export function activate(cns, label) {
    const newCNS = { ...cns };
    newCNS[label] = { value: 100 };
    return newCNS;
}

/**
 * Get the activation value of the node which `label` is given
 *
 * @export
 * @param {ConceptNetworkState} cns
 * @param {string}              label
 * @returns {number|undefined}
 */
export function getActivationValue(cns, label) {
    if (!(label in cns)) return undefined;
    const state = cns[label];
    if (!('value' in state)) return undefined;
    return state.value;
}

/**
 * Get the activation value of a node (which `label` is given)
 *
 * @export
 * @param {ConceptNetworkState} cns
 * @param {string}              label
 * @returns {number|undefined}
 */
export function getOldActivationValue(cns, label) {
    if (!(label in cns)) return undefined;
    const state = cns[label];
    if (!('old' in state)) return 0;
    return state.old;
}

/**
 * Get the maximum activation value of all nodes which label starts with
 * `beginning`.
 *
 * @export
 * @param {ConceptNetworkState} cns
 * @param {string}              [beginning='']
 * @returns {number}
 */
export function getMaxActivationValue(cns, beginning = '') {
    const max = Object.keys(cns)
        .filter(key => key.startsWith(beginning))
        .reduce(
            (max, currentLabel) => Math.max(max, cns[currentLabel].value),
            0,
        );
    return max;
}

/**
 * Return an object associating nodes labels with their activation values, but
 * only for labels starting with `beginning` and activation values greater or
 * equal to `threshold`.
 *
 * @export
 * @param {ConceptNetworkState} cns
 * @param {string} [beginning='']
 * @param {number} [threshold=95]
 * @returns {{ [index: string]: number }}
 */
export function getActivatedTypedNodes(cns, beginning = '', threshold = 95) {
    const nodes = Object.keys(cns)
        .filter(key => key.startsWith(beginning))
        .filter(label => cns[label] !== undefined)
        .filter(label => cns[label].value >= threshold)
        .reduce(
            (nodes, label) => ({ ...nodes, [label]: cns[label].value }),
            {},
        );
    return nodes;
}

/**
 * Set the activation `value` of a node `label`.
 *
 * @export
 * @param {ConceptNetworkState} cns
 * @param {string} label
 * @param {number} value
 * @returns {ConceptNetworkState}
 */
export function setActivationValue(cns = {}, label, value) {
    const oldNodeState = cns[label];
    return {
        ...cns,
        [label]: { ...oldNodeState, value },
    };
}
