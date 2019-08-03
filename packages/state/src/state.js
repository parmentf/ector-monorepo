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
