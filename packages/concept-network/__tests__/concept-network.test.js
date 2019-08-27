'use strict';

import * as CN from '../src/concept-network';

describe('@ector/concept-network', () => {
    describe('get node', () => {
        it('should get the second node', () => {
            const cn = {
                node: [{ label: 'a', occ: 1}, { label: 'b', occ: 2}]
            };
            const node = CN.getNode(cn, 'b');
            expect(node).toEqual({
                label: 'b',
                occ: 2
            });
            expect(node).not.toBe(cn.node[1]);
        });

        it('should return undefined when node does not exist', () => {
            expect(CN.getNode({
                node: [{ label: 'a', occ: 1}, { label: 'b', occ: 2}]
            }, 'Nonexistent')).toEqual(undefined);
        });

        it('should return undefined when no nodes', () => {
            expect(CN.getNode({
            }, 'Nonexistent')).toEqual(undefined);
        });
    });

    describe('get node index', () => {
        it('should get the second node', () => {
            expect(CN.getNodeIndex({
                node: [{ label: 'a', occ: 1}, { label: 'b', occ: 2}]
            }, 'b')).toEqual(1);
        });

        it('should return -1 when node does not exist', () => {
            expect(CN.getNodeIndex({
                node: [{ label: 'a', occ: 1}, { label: 'b', occ: 2}]
            }, 'Nonexistent')).toEqual(-1);
        });

        it('should return -1 when no nodes', () => {
            expect(CN.getNodeIndex({
            }, 'Nonexistent')).toEqual(-1);
        });
    });

    describe('add node', () => {
        it('should return an object', () => {
            const resultingCN = CN.addNode({}, 'Chuck Norris');
            expect(resultingCN).toEqual({
                node: [{
                    label: 'Chuck Norris',
                    occ: 1,
                }]
            });
        });

        it('should work with nodes', () => {
            expect(CN.addNode({ node: [{ label: 'A', occ: 1 }]}, 'Chuck Norris'))
                .toEqual({
                    node: [{
                        label: 'A', occ: 1
                    }, {
                        label: 'Chuck Norris', occ: 1
                    }]
                });
        });

        it('should increment occ', () => {
            expect(CN.addNode({ node: [{ label: 'A', occ: 1}]}, 'A'))
                .toEqual({
                    node: [{
                        label: 'A', occ: 2
                    }]
                });
        });
    });

    describe('add link', () => {
        it('should create the link', () => {
            expect(CN.addLink({
                node: [{ label: 'a', occ: 1 }, { label: 'b', occ: 1 }]
            }, 'a', 'b')).toEqual({
                node: [{ label: 'a', occ: 1 }, { label: 'b', occ: 1 }],
                link: [{ from: 0, to: 1, coOcc: 1}]
            });
        });

        it('should increment coOcc', () => {
            expect(CN.addLink({
                node: [{ label: 'a', occ: 1 }, { label: 'b', occ: 1 }],
                link: [{ from: 0, to: 1, coOcc: 1}]
            }, 'a', 'b')).toEqual({
                node: [{ label: 'a', occ: 1 }, { label: 'b', occ: 1 }],
                link: [{ from: 0, to: 1, coOcc: 2}]
            });
        });

        it('should return same object when to node not found', () => {
            expect(CN.addLink({
                node: [{ label: 'a', occ: 1 }, { label: 'b', occ: 1 }],
                link: [{ from: 0, to: 1, coOcc: 1}]
            }, 'a', 'c')).toEqual({
                node: [{ label: 'a', occ: 1 }, { label: 'b', occ: 1 }],
                link: [{ from: 0, to: 1, coOcc: 1}]
            });
        });

        it('should return same object when from node not found', () => {
            expect(CN.addLink({
                node: [{ label: 'a', occ: 1 }, { label: 'b', occ: 1 }],
                link: [{ from: 0, to: 1, coOcc: 1}]
            }, 'c', 'a')).toEqual({
                node: [{ label: 'a', occ: 1 }, { label: 'b', occ: 1 }],
                link: [{ from: 0, to: 1, coOcc: 1}]
            });
        });

        it('should return same object when no nodes', () => {
            expect(CN.addLink({}, 'a', 'b')).toEqual({});
        })
    });

    describe('get link', () => {
        it('should get link', () => {
            expect(CN.getLink({
                node: [{ label: 'a', occ: 2 }, { label: 'b', occ: 2 }, { label: 'c', occ: 1 }],
                link: [{ from: 0, to: 2, coOcc: 1 }, { from: 0, to: 1, coOcc: 2}, { from: 1, to: 2, coOcc: 1}]
            }, 'a', 'b')).toEqual({
                from: 0, to: 1, coOcc: 2
            });
        });

        it('should return undefined when node does not exist', () => {
            expect(CN.getLink({
                node: [{ label: 'a', occ: 2 }, { label: 'b', occ: 2 }, { label: 'c', occ: 1 }],
                link: [{ from: 0, to: 2, coOcc: 1 }, { from: 0, to: 1, coOcc: 2}, { from: 1, to: 2, coOcc: 1}]
            }, 'a', 'z')).toEqual(undefined);
        });

        it('should return undefined when no nodes', () => {
            expect(CN.getLink({
                link: [{ from: 0, to: 2, coOcc: 1 }, { from: 0, to: 1, coOcc: 2}, { from: 1, to: 2, coOcc: 1}]
            }, 'a', 'z')).toEqual(undefined);
        });

        it('should return undefined when no links', () => {
            expect(CN.getLink({
                node: [{ label: 'a', occ: 2 }, { label: 'b', occ: 2 }, { label: 'c', occ: 1 }],
            }, 'a', 'z')).toEqual(undefined);
        });
    });

    describe('get links from node', () => {
        it('should get all links from node b', () => {
            expect(CN.getLinksFrom({
                node: [{ label: 'a', occ: 2 }, { label: 'b', occ: 2 }, { label: 'c', occ: 1 }],
                link: [{ from: 0, to: 2, coOcc: 1 }, { from: 0, to: 1, coOcc: 2}, { from: 1, to: 2, coOcc: 1}]
            }, 'b')).toEqual([{ from: 1, to: 2, coOcc: 1}]);
        });

        it('should get all links from node a', () => {
            expect(CN.getLinksFrom({
                node: [{ label: 'a', occ: 2 }, { label: 'b', occ: 2 }, { label: 'c', occ: 1 }],
                link: [{ from: 0, to: 2, coOcc: 1 }, { from: 0, to: 1, coOcc: 2}, { from: 1, to: 2, coOcc: 1}]
            }, 'a')).toEqual([
                { from: 0, to: 2, coOcc: 1 },
                { from: 0, to: 1, coOcc: 2}
            ]);
        });

        it('should get no links from node c', () => {
            expect(CN.getLinksFrom({
                node: [{ label: 'a', occ: 2 }, { label: 'b', occ: 2 }, { label: 'c', occ: 1 }],
                link: [{ from: 0, to: 2, coOcc: 1 }, { from: 0, to: 1, coOcc: 2}, { from: 1, to: 2, coOcc: 1}]
            }, 'c')).toEqual([]);
        });

        it('should return no links when no links', () => {
            expect(CN.getLinksFrom({
                node: [{ label: 'a', occ: 2 }, { label: 'b', occ: 2 }, { label: 'c', occ: 1 }],
            }, 'b')).toEqual([]);
        });

        it('should return no links when no nodes', () => {
            expect(CN.getLinksFrom({
                link: [{ from: 0, to: 2, coOcc: 1 }, { from: 0, to: 1, coOcc: 2}, { from: 1, to: 2, coOcc: 1}]
            }, 'b')).toEqual([]);
        });
    });

    describe('get links to node', () => {
        it('should get all links to node b', () => {
            expect(CN.getLinksTo({
                node: [{ label: 'a', occ: 2 }, { label: 'b', occ: 2 }, { label: 'c', occ: 1 }],
                link: [{ from: 0, to: 2, coOcc: 1 }, { from: 0, to: 1, coOcc: 2}, { from: 1, to: 2, coOcc: 1}]
            }, 'b')).toEqual([{ from: 0, to: 1, coOcc: 2}]);
        });

        it('should get all links to node c', () => {
            expect(CN.getLinksTo({
                node: [{ label: 'a', occ: 2 }, { label: 'b', occ: 2 }, { label: 'c', occ: 1 }],
                link: [{ from: 0, to: 2, coOcc: 1 }, { from: 0, to: 1, coOcc: 2}, { from: 1, to: 2, coOcc: 1}]
            }, 'c')).toEqual([
                { from: 0, to: 2, coOcc: 1 },
                { from: 1, to: 2, coOcc: 1}
            ]);
        });

        it('should get no links to node a', () => {
            expect(CN.getLinksTo({
                node: [{ label: 'a', occ: 2 }, { label: 'b', occ: 2 }, { label: 'c', occ: 1 }],
                link: [{ from: 0, to: 2, coOcc: 1 }, { from: 0, to: 1, coOcc: 2}, { from: 1, to: 2, coOcc: 1}]
            }, 'a')).toEqual([]);
        });

        it('should return no links when no links', () => {
            expect(CN.getLinksTo({
                node: [{ label: 'a', occ: 2 }, { label: 'b', occ: 2 }, { label: 'c', occ: 1 }],
            }, 'b')).toEqual([]);
        });

        it('should return no links when no nodes', () => {
            expect(CN.getLinksTo({
                link: [{ from: 0, to: 2, coOcc: 1 }, { from: 0, to: 1, coOcc: 2}, { from: 1, to: 2, coOcc: 1}]
            }, 'b')).toEqual([]);
        });
    });

    describe('remove node', () =>  {
        it('should remove even a node with occ value of 2', () => {
            expect(CN.removeNode({
                node: [{ label: 'a', occ: 2 }]
            }, 'a')).toEqual({
                node: []
            });
        });

        it('should remove the links from the removed node', () => {
            expect(CN.removeNode({
                node: [{ label: 'a', occ: 1 }, { label: 'b', occ: 2 }],
                link: [{ from: 0, to: 1, coOcc: 1}]
            }, 'a')).toEqual({
                node: [undefined, { label: 'b', occ: 2 }],
                link: []
            });
        });

        it('should remove the links to the removed node', () => {
            expect(CN.removeNode({
                node: [{ label: 'a', occ: 1 }, { label: 'b', occ: 2 }],
                link: [{ from: 0, to: 1, coOcc: 1}]
            }, 'b')).toEqual({
                node: [{ label: 'a', occ: 1 }],
                link: []
            });
        });

        it('should return same concept when no node', () => {
            expect(CN.removeNode({}, 'a')).toEqual({});
        });

        it('should return same concept when node does not exist', () => {
            expect(CN.removeNode({
                node: [{ label: 'a', occ: 1 }]
            }, 'b')).toEqual({
                node: [{ label: 'a', occ: 1 }],
            });
        });
    });

    describe('remove links of node', () => {
        it('should remove link from', () => {
            expect(CN.removeLinksOfNode({
                node: [{ label: 'a', occ: 1 }, { label: 'b', occ: 2 }, { label: 'c', occ: 1 }],
                link: [{ from: 0, to: 1, coOcc: 2}]
            }, 'a')).toEqual({
                node: [{ label: 'a', occ: 1 }, { label: 'b', occ: 2 }, { label: 'c', occ: 1 }],
                link: []
            });
        });

        it('should remove link to', () => {
            expect(CN.removeLinksOfNode({
                node: [{ label: 'a', occ: 1 }, { label: 'b', occ: 2 }, { label: 'c', occ: 1 }],
                link: [{ from: 0, to: 1, coOcc: 2}]
            }, 'b')).toEqual({
                node: [{ label: 'a', occ: 1 }, { label: 'b', occ: 2 }, { label: 'c', occ: 1 }],
                link: []
            });
        });

        it('should remove link from & to', () => {
            expect(CN.removeLinksOfNode({
                node: [{ label: 'a', occ: 1 }, { label: 'b', occ: 2 }, { label: 'c', occ: 1 }],
                link: [{ from: 0, to: 1, coOcc: 2}, { from: 2, to: 1, coOcc: 1}]
            }, 'b')).toEqual({
                node: [{ label: 'a', occ: 1 }, { label: 'b', occ: 2 }, { label: 'c', occ: 1 }],
                link: []
            });
        });

        it('should remove link among others', () => {
            expect(CN.removeLinksOfNode({
                node: [{ label: 'a', occ: 1 }, { label: 'b', occ: 2 }, { label: 'c', occ: 1 }],
                link: [{ from: 0, to: 1, coOcc: 2}, { from: 0, to: 2, coOcc: 1}]
            }, 'b')).toEqual({
                node: [{ label: 'a', occ: 1 }, { label: 'b', occ: 2 }, { label: 'c', occ: 1 }],
                link: [{ from: 0, to: 2, coOcc: 1}]
            });
        });
    });

    describe('remove link', () => {
        it('should remove the link', () => {
            expect(CN.removeLink({
                node: [{ label: 'a', occ: 1 }, { label: 'b', occ: 2 }],
                link: [{ from: 0, to: 1, coOcc: 2}]
            }, 'a', 'b')).toEqual({
                node: [{ label: 'a', occ: 1 }, { label: 'b', occ: 2 }],
                link: []
            });
        });

        it('should return same network when no link', () => {
            expect(CN.removeLink({
                node: [{ label: 'a', occ: 1 }, { label: 'b', occ: 2 }],
            }, 'a', 'b')).toEqual({
                node: [{ label: 'a', occ: 1 }, { label: 'b', occ: 2 }],
            });
        });

        it('should return same network when link does not exist', () => {
            expect(CN.removeLink({
                node: [{ label: 'a', occ: 1 }, { label: 'b', occ: 2 }],
                link: [{ from: 0, to: 1, coOcc: 2}]
            }, 'a', 'c')).toEqual({
                node: [{ label: 'a', occ: 1 }, { label: 'b', occ: 2 }],
                link: [{ from: 0, to: 1, coOcc: 2}]
            });
        });

        it('should return same network when link could exist but does not', () => {
            expect(CN.removeLink({
                node: [{ label: 'a', occ: 1 }, { label: 'b', occ: 2 }, { label: 'c', occ: 1 }],
                link: [{ from: 0, to: 1, coOcc: 2}]
            }, 'a', 'c')).toEqual({
                node: [{ label: 'a', occ: 1 }, { label: 'b', occ: 2 }, { label: 'c', occ: 1 }],
                link: [{ from: 0, to: 1, coOcc: 2}]
            });
        });

        it('should remove one link among others', () => {
            expect(CN.removeLink({
                node: [{ label: 'a', occ: 1 }, { label: 'b', occ: 2 }, { label: 'c', occ: 1 }],
                link: [{ from: 0, to: 2, coOcc: 1 }, { from: 0, to: 1, coOcc: 2}, { from: 1, to: 2, coOcc: 1}]
            }, 'a', 'b')).toEqual({
                node: [{ label: 'a', occ: 1 }, { label: 'b', occ: 2 }, { label: 'c', occ: 1 }],
                link: [{ from: 0, to: 2, coOcc: 1 }, { from: 1, to: 2, coOcc: 1}]
            });
        });
    });

    describe('get link index', () => {
        it('should get link index', () => {
            expect(CN.getLinkIndex({
                node: [{ label: 'a', occ: 2 }, { label: 'b', occ: 2 }, { label: 'c', occ: 1 }],
                link: [{ from: 0, to: 2, coOcc: 1 }, { from: 0, to: 1, coOcc: 2}, { from: 1, to: 2, coOcc: 1}]
            }, 'a', 'b')).toEqual(1);
        });

        it('should return -1 when node does not exist', () => {
            expect(CN.getLinkIndex({
                node: [{ label: 'a', occ: 2 }, { label: 'b', occ: 2 }, { label: 'c', occ: 1 }],
                link: [{ from: 0, to: 2, coOcc: 1 }, { from: 0, to: 1, coOcc: 2}, { from: 1, to: 2, coOcc: 1}]
            }, 'a', 'z')).toEqual(-1);
        });

        it('should return -1 when no nodes', () => {
            expect(CN.getLinkIndex({
                link: [{ from: 0, to: 2, coOcc: 1 }, { from: 0, to: 1, coOcc: 2}, { from: 1, to: 2, coOcc: 1}]
            }, 'a', 'z')).toEqual(-1);
        });

        it('should return -1 when no links', () => {
            expect(CN.getLinkIndex({
                node: [{ label: 'a', occ: 2 }, { label: 'b', occ: 2 }, { label: 'c', occ: 1 }],
            }, 'a', 'z')).toEqual(-1);
        });
    });

    describe('get link index from nodes index', () => {
        it('should get link index', () => {
            expect(CN.getLinkIndex2({
                node: [{ label: 'a', occ: 2 }, { label: 'b', occ: 2 }, { label: 'c', occ: 1 }],
                link: [{ from: 0, to: 2, coOcc: 1 }, { from: 0, to: 1, coOcc: 2}, { from: 1, to: 2, coOcc: 1}]
            }, 0, 1)).toEqual(1);
        });

        it('should return -1 when node does not exist', () => {
            expect(CN.getLinkIndex2({
                node: [{ label: 'a', occ: 2 }, { label: 'b', occ: 2 }, { label: 'c', occ: 1 }],
                link: [{ from: 0, to: 2, coOcc: 1 }, { from: 0, to: 1, coOcc: 2}, { from: 1, to: 2, coOcc: 1}]
            }, 0, 100)).toEqual(-1);
        });

        it('should return even when no nodes', () => {
            expect(CN.getLinkIndex2({
                link: [{ from: 0, to: 2, coOcc: 1 }, { from: 0, to: 1, coOcc: 2}, { from: 1, to: 2, coOcc: 1}]
            }, 0, 1)).toEqual(1);
        });

        it('should return -1 when no links', () => {
            expect(CN.getLinkIndex2({
                node: [{ label: 'a', occ: 2 }, { label: 'b', occ: 2 }, { label: 'c', occ: 1 }],
            }, 0, 1)).toEqual(-1);
        });
    });

    describe('decrement node', () => {
        it('should decrement a node with occ of 3', () => {
            expect(CN.decrementNode({
                node: [{ label: 'Chuck Norris', occ: 3 }]
            }, 'Chuck Norris'))
                .toEqual({
                    node: [{ label: 'Chuck Norris', occ: 2 }]
                });
        });

        it('should remove a node with an occ of 1', () => {
            expect(CN.decrementNode({
                node: [{ label: 'World', occ: 1 }]
            }, 'World'))
                .toEqual({
                    node: []
                });
        });

        it('should return the network when the node does not exist', () => {
            expect(CN.decrementNode({
                node: [{ label: 'World', occ: 1}]
            }, 'Foo'))
                .toEqual({
                    node: [{ label: 'World', occ: 1}]
                });
        });

        it('should return the network when no node exist', () => {
            expect(CN.decrementNode({}, 'Bar')).toEqual({});
        });
    });

    describe('increment node beginning', () => {
        it('should initialize when beg does not exist', () => {
            expect(CN.incrementBeginning({
                node: [{ label: 'Chuck Norris', occ: 1 }]
            }, 'Chuck Norris'))
                .toEqual({
                    node: [{ label: 'Chuck Norris', occ: 1, beg: 1 }]
                });
        });

        it('should increment a node with beg of 3', () => {
            expect(CN.incrementBeginning({
                node: [{ label: 'Chuck Norris', occ: 4, beg: 3 }]
            }, 'Chuck Norris'))
                .toEqual({
                    node: [{ label: 'Chuck Norris', occ: 4, beg: 4 }]
                });
        });

        it('should return the network when the node does not exist', () => {
            expect(CN.incrementBeginning({
                node: [{ label: 'World', occ: 4, beg: 1}]
            }, 'Foo'))
                .toEqual({
                    node: [{ label: 'World', occ: 4, beg: 1}]
                });
        });

        it('should return the network when no node exist', () => {
            expect(CN.incrementBeginning({}, 'Bar')).toEqual({});
        });
    });

    describe('increment node middle', () => {
        it('should initialize when mid does not exist', () => {
            expect(CN.incrementMiddle({
                node: [{ label: 'Chuck Norris', occ: 1 }]
            }, 'Chuck Norris'))
                .toEqual({
                    node: [{ label: 'Chuck Norris', occ: 1, mid: 1 }]
                });
        });

        it('should increment a node with mid of 3', () => {
            expect(CN.incrementMiddle({
                node: [{ label: 'Chuck Norris', occ: 4, mid: 3 }]
            }, 'Chuck Norris'))
                .toEqual({
                    node: [{ label: 'Chuck Norris', occ: 4, mid: 4 }]
                });
        });

        it('should return the network when the node does not exist', () => {
            expect(CN.incrementMiddle({
                node: [{ label: 'World', occ: 4, mid: 1}]
            }, 'Foo'))
                .toEqual({
                    node: [{ label: 'World', occ: 4, mid: 1}]
                });
        });

        it('should return the network when no node exist', () => {
            expect(CN.incrementMiddle({}, 'Bar')).toEqual({});
        });
    });

    describe('increment node end', () => {
        it('should initialize when end does not exist', () => {
            expect(CN.incrementEnd({
                node: [{ label: 'Chuck Norris', occ: 1 }]
            }, 'Chuck Norris'))
                .toEqual({
                    node: [{ label: 'Chuck Norris', occ: 1, end: 1 }]
                });
        });

        it('should increment a node with end of 3', () => {
            expect(CN.incrementEnd({
                node: [{ label: 'Chuck Norris', occ: 4, end: 3 }]
            }, 'Chuck Norris'))
                .toEqual({
                    node: [{ label: 'Chuck Norris', occ: 4, end: 4 }]
                });
        });

        it('should return the network when the node does not exist', () => {
            expect(CN.incrementEnd({
                node: [{ label: 'World', occ: 4, end: 1}]
            }, 'Foo'))
                .toEqual({
                    node: [{ label: 'World', occ: 4, end: 1}]
                });
        });

        it('should return the network when no node exist', () => {
            expect(CN.incrementEnd({}, 'Bar')).toEqual({});
        });
    });

    describe('decrement link', () => {
        it('should decrement a coOcc value of 2', () => {
            expect(CN.decrementLink({
                node: [{ label: 'a', occ: 3}, { label: 'b', occ: 2}],
                link: [{ from: 0, to: 1, coOcc: 2}]
            }, 'a', 'b')).toEqual({
                node: [{ label: 'a', occ: 3}, { label: 'b', occ: 2}],
                link: [{ from: 0, to: 1, coOcc: 1}]
            });
        });

        it('should remove a link with a coOcc value of 0', () => {
            expect(CN.decrementLink({
                node: [{ label: 'a', occ: 3}, { label: 'b', occ: 2}],
                link: [{ from: 0, to: 1, coOcc: 1}]
            }, 'a', 'b')).toEqual({
                node: [{ label: 'a', occ: 3}, { label: 'b', occ: 2}],
                link: []
            });
        });

        it('should return same network when no node', () => {
            expect(CN.decrementLink({
                link: [{ from: 0, to: 1, coOcc: 1}]
            }, 'a', 'b')).toEqual({
                link: [{ from: 0, to: 1, coOcc: 1}]
            });
        });

        it('should return same network when no link', () => {
            expect(CN.decrementLink({
                node: [{ label: 'a', occ: 3}, { label: 'b', occ: 2}],
            }, 'a', 'b')).toEqual({
                node: [{ label: 'a', occ: 3}, { label: 'b', occ: 2}],
            });
        });

        it('should return same network when no link found', () => {
            expect(CN.decrementLink({
                node: [{ label: 'a', occ: 3}, { label: 'b', occ: 2}],
                link: [{ from: 0, to: 1, coOcc: 1}]
            }, 'a', 'c')).toEqual({
                node: [{ label: 'a', occ: 3}, { label: 'b', occ: 2}],
                link: [{ from: 0, to: 1, coOcc: 1}]
            });
        });
    });

    describe('merge', () => {
        it('should add occurrences and co-occurrences', () => {
            expect(CN.merge({
                node: [{ label: 'a', occ: 1 }, { label: 'b', occ: 2 }],
                link: [{ from: 0, to: 1, coOcc: 1}]
            }, {
                node: [{ label: 'a', occ: 1 }, { label: 'b', occ: 1 }],
                link: [{ from: 0, to: 1, coOcc: 1}]
            })).toEqual({
                node: [{ label: 'a', occ: 2 }, { label: 'b', occ: 3 }],
                link: [{ from: 0, to: 1, coOcc: 2}]
            });
        });
    });
});
