'use strict';

/**
 *
 * @typedef {Object<string, any>} ConceptNetworkNode
 * @property {string} label
 * @property {number} occ
 *
 * @typedef {Object<string, any>} ConceptNetworkLink
 * @property {number} from
 * @property {number} to
 * @property {number} coOcc
 *
 * @typedef {Object<string, any>} ConceptNetwork
 * @property {ConceptNetworkNode[]} [node]
 * @property {ConceptNetworkLink[]} [link]
 */

/**
 * Get the node matching `label`.
 *
 * @export
 * @param {ConceptNetwork}  cn
 * @param {string} label    label of the node to get
 * @returns {ConceptNetworkNode|undefined}
 */
export function getNode(cn, label) {
    if (!cn.node) return undefined;
    const node = cn.node.find(n => n.label === label);
    if (!node) return undefined;
    return { ...node };
}

/**
 * Get the index of the node matching `label`.
 *
 * @export
 * @param {ConceptNetwork}  cn
 * @param {string}  label   label of the node to get
 * @returns {number}        -1 when not found
 */
export function getNodeIndex(cn, label) {
    if (!cn.node) return -1;
    const nodeIndex = cn.node.findIndex(n => n.label === label);
    return nodeIndex;
}

/**
 * Create a node in `cn` or increment its occurrence.
 *
 * @param {ConceptNetwork}  cn
 * @param {string}          label
 * @returns
 */
export function addNode(cn, label) {
    const res = Object.assign({}, cn);
    if (res.node) {
        const node = getNode(res, label);
        const nodeIndex = getNodeIndex(res, label);

        if (node) {
            node.occ = node.occ + 1;
            res.node[nodeIndex] = node;
        } else {
            res.node.push({ label, occ: 1 });
        }
    } else {
        res.node = [{
            label,
            occ: 1
        }];
    }

    return res;
};

/**
 * Create a link between `from` and `to`, and increment `coOcc` by one.
 *
 * @export
 * @param {ConceptNetwork} cn
 * @param {string}  from
 * @param {string}  to
 * @returns {ConceptNetwork}    the new ConceptNetwork
 */
export function addLink(cn, from, to) {
    const res = Object.assign({}, cn);
    if (!res.node) return res;
    const fromIndex = getNodeIndex(res, from);
    const toIndex = getNodeIndex(res, to);
    if (fromIndex === -1 || toIndex === -1) return res;
    if (!res.link) res.link = [];
    const link = res.link.find(l => l.from === fromIndex && l.to === toIndex);
    if (!link) {
        res.link.push({ from: fromIndex, to: toIndex, coOcc: 1});
    } else {
        link.coOcc = link.coOcc + 1;
    }
    return res;
}

/**
 * Get the link from `from` to `to`.
 *
 * @export
 * @param {ConceptNetwork} cn
 * @param {string}  from   label of the node from
 * @param {string}  to     label of the node to
 * @returns {ConceptNetworkLink|undefined}
 */
export function getLink(cn, from, to) {
    if (!cn.node || !cn.link) return undefined;
    const fromIndex = getNodeIndex(cn, from);
    const toIndex = getNodeIndex(cn, to);
    const link = cn.link.find(l => l.from === fromIndex && l.to === toIndex);
    if (!link) return undefined;
    return { ...link };
}

/**
 * Get the links from `label` node.
 *
 * @export
 * @param {ConceptNetwork} cn
 * @param {string}      label   label of the node from
 * @returns {ConceptNetworkLink[]}
 */
export function getLinksFrom(cn, label) {
    if (!cn.node || !cn.link) return [];
    const fromIndex = getNodeIndex(cn, label);
    const links = cn.link.filter(l => l.from === fromIndex);
    return links;
}

/**
 * Get the links to `label` node.
 *
 * @export
 * @param {ConceptNetwork} cn
 * @param {string}      label   label of the node to
 * @returns {ConceptNetworkLink[]}
 */
export function getLinksTo(cn, label) {
    if (!cn.node || !cn.link) return [];
    const toIndex = getNodeIndex(cn, label);
    const links = cn.link.filter(l => l.to === toIndex);
    return links;
}

/**
 * Remove the node which `label` is given (and the links to it)
 *
 * @export
 * @param {ConceptNetwork}  cn
 * @param {string}          label
 * @returns {ConceptNetwork} the new ConceptNetwork
 */
export function removeNode(cn, label) {
    const res = Object.assign({}, cn);
    if (!res.node) {
        return res;
    }
    const nodeIndex = getNodeIndex(res, label);
    if (nodeIndex === -1) {
        return res;
    }
    // remove links from and to the node
    const res2 = removeLinksOfNode(res, label);
    // remove the node, but do not shift next nodes' indices
    res2.node[nodeIndex] = undefined;
    // remove all ending undefined
    const nodes = res2.node
        .reduceRight(
            /**
             * @param {ConceptNetworkNode[]} nodes
             * @param {ConceptNetworkNode} node
             * @returns {ConceptNetworkNode[]}
             */
            (nodes, node) => {
                if (!node && nodes.length === 0) return [];
                nodes.push(node);
                return nodes;
            },
            []);
    res2.node = nodes.reverse();
    return res2;
}

/**
 * Remove all links of the node which `label` is given.
 *
 * @export
 * @param {ConceptNetwork}  cn
 * @param {string}          label   label of the node which links are to be
 *                                  removed
 * @returns {ConceptNetwork}        new ConceptNetwork
 */
export function removeLinksOfNode(cn, label) {
    if (!cn.node || !cn.link) return cn;
    const nodeIndex = getNodeIndex(cn, label);
    const linksIndices = cn.link
        .map(l => l.from === nodeIndex || l.to === nodeIndex)
        .map((found, i) => { if (found) return i; else return; });
    const link = cn.link.filter((l, i) => !linksIndices.includes(i));
    const res = {
        ...cn,
        link,
    }
    return res;
}

/**
 * Remove the link from `from` to `to`
 *
 * @export
 * @param {ConceptNetwork} cn
 * @param {string}  from    label of the outgoing node
 * @param {string}  to      label of the ingoing node
 * @returns {ConceptNetwork} the new ConceptNetwork
 */
export function removeLink(cn, from, to) {
    const res = Object.assign({}, cn);
    if (!res.link) return res;
    const fromIndex = getNodeIndex(res, from);
    const toIndex = getNodeIndex(res, to);
    if (fromIndex === -1 || toIndex === -1) return res;
    const linkIndex = getLinkIndex2(res, fromIndex, toIndex);
    if (linkIndex === -1) return res;
    res.link.splice(linkIndex, 1);
    return res;
}

/**
 * Get the index of the link from `from` to `to`.
 *
 * @export
 * @param {ConceptNetwork} cn
 * @param {string}  from   label of the node from
 * @param {string}  to     label of the node to
 * @returns {number}       -1 when not found
 */
export function getLinkIndex(cn, from, to) {
    if (!cn.node || !cn.link) return -1;
    const fromIndex = getNodeIndex(cn, from);
    const toIndex = getNodeIndex(cn, to);
    const linkIndex = getLinkIndex2(cn, fromIndex, toIndex);
    return linkIndex;
}

/**
 * Get the index of the link from `fromIndex` to `toIndex`.
 *
 * @export
 * @param {ConceptNetwork} cn
 * @param {number}  fromIndex   label of the node from
 * @param {number}  toIndex     label of the node to
 * @returns {number}            -1 when not found
 */
export function getLinkIndex2(cn, fromIndex, toIndex) {
    if (!cn.link) return -1;
    const linkIndex = cn.link.findIndex(l => l.from === fromIndex && l.to === toIndex);
    return linkIndex;
}

/**
 * Decrement the `occ` of the node which `label` is given by one.
 *
 * @export
 * @param {ConceptNetwork}  cn
 * @param {string}          label
 * @returns {ConceptNetwork} the new ConceptNetwork
 */
export function decrementNode(cn, label) {
    const res = Object.assign({}, cn);
    if (!res.node) {
        return res;
    }
    const node = getNode(res, label);
    const nodeIndex = getNodeIndex(res, label);
    if (node) {
        node.occ = node.occ - 1;
        res.node[nodeIndex] = node;
        if (node.occ === 0) {
            res.node.splice(nodeIndex, 1);
        }
    }
    return res;
}

/**
 * Decrement the coOcc of the link from `from` to `to` by one.
 *
 * @export
 * @param {ConceptNetwork} cn
 * @param {string}  from label of the from node
 * @param {string}  to   label of the to node
 * @returns {ConceptNetwork}    new ConceptNetwork
 */
export function decrementLink(cn, from, to) {
    if (!cn.node || !cn.link) return cn;
    const fromIndex = getNodeIndex(cn, from);
    const toIndex = getNodeIndex(cn, to);
    const linkIndex = getLinkIndex2(cn, fromIndex, toIndex);
    if (linkIndex === -1) return cn;
    const res = Object.assign({}, cn);
    const link = res.link[linkIndex];
    link.coOcc -= 1;
    if (link.coOcc === 0) res.link.splice(linkIndex, 1);
    return res;
}

export default {
    addLink,
    addNode,
    decrementLink,
    decrementNode,
    getLink,
    getLinkIndex,
    getLinkIndex2,
    getLinksFrom,
    getLinksTo,
    getNode,
    getNodeIndex,
    removeLink,
    removeLinksOfNode,
    removeNode
}