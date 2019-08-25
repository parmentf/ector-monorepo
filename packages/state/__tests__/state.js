'use strict';

import * as CN from '../../concept-network/src/concept-network';
import * as CNS from '../src/state';

describe('@ector/state', () => {
    describe('activate', () => {
        it('should set the node activation value to 100', () => {
            expect(CNS.activate({}, 'a')).toEqual({
                'a': { value: 100 }
            })
        });

        it('should return a state even if none was given ', () => {
            expect(CNS.activate(null, 'a')).toEqual({
                a: { value: 100 }
            });
        });

        it('should return all other activation values', () => {
            const cns = { b: { value: 50 } };
            expect(CNS.activate(cns, 'a')).toEqual({
                a: { value: 100 },
                b: { value: 50 }
            });
        });

        it('should replace older activation values', () => {
            const cns = { a: { value: 50 } };
            expect(CNS.activate(cns, 'a')).toEqual({
                a: { value: 100 }
            });
        });

        it('should cap the activation of an activated node', () => {
            const cns = { a: { value: 101 } };
            expect(CNS.activate(cns, 'a')).toEqual({
                a: { value: 100 }
            });
        });
    });

    describe('getters', () => {
        describe('activation value', () => {
            it('should get a zero activation value', () => {
                const cns = { a: { value: 0 }};
                expect(CNS.getActivationValue(cns, 'a')).toEqual(0);
            });

            it('should get a 100 activation value', () => {
                const cns = { a: { value: 100 }};
                expect(CNS.getActivationValue(cns, 'a')).toEqual(100);
            });

            it('should get 0 for a non-existing node', () => {
                const cns = { a: { value: 0 }};
                expect(CNS.getActivationValue(cns, 'b')).toEqual(0);
            });

            it('should get 0 for a non-existing activation value', () => {
                const cns = { a: { old: 2 } };
                expect(CNS.getActivationValue(cns, 'a')).toEqual(0);
            });
        });

        describe('old activation value', () => {
            it('should get a zero activation value by default', () => {
                const cns = { a: { value: 100 }};
                expect(CNS.getOldActivationValue(cns, 'a')).toEqual(0);
            });

            it('should get the old activation value', () => {
                const cns = { a: { old: 50, value: 0 }};
                expect(CNS.getOldActivationValue(cns, 'a')).toEqual(50);
            });

            it('should return undefined for a non-existing old value', () => {
                const cns = { a: { value: 59 }};
                expect(CNS.getOldActivationValue(cns, 'z')).toEqual(undefined);
            });
        });

        describe('get maximum activation value', () => {
            it('should return 0 when no node activated', () => {
                expect(CNS.getMaxActivationValue({})).toEqual(0);
            });

            it('should get the maximum activation value', () => {
                expect(CNS.getMaxActivationValue({
                    a: { value: 10 },
                    b: { value: 20 }
                })).toEqual(20);
            });

            it('should get tne maximum activation value for s tokens', () => {
                expect(CNS.getMaxActivationValue({
                    sa: { value: 10 },
                    sb: { value: 20 },
                    ta: { value: 30 }
                }, 's')).toEqual(20);
            });
        });

        describe('get activated typed nodes', () => {
            it('should return an empty object when no node is activated', () => {
                expect(CNS.getActivatedTypedNodes({ a: { value: 50 }}))
                    .toEqual({});
            });

            it('should return one-node-object when one node is activated', () => {
                expect(CNS.getActivatedTypedNodes({ a: { value: 100 }}))
                    .toEqual({ a: 100 });
            });

            it('should return two-nodes-object with two activated nodes', () => {
                expect(CNS.getActivatedTypedNodes({ a: { value: 100 }, b: { value: 95 }}))
                    .toEqual({ a: 100, b: 95 });
            });

            it('should return one-node-object of type s', () => {
                expect(CNS.getActivatedTypedNodes({ a: { value: 100 }, sb: { value: 95 }}, 's'))
                    .toEqual({ sb: 95 });
            });

            it('should return one-node-object where threshold = 96', () => {
                expect(CNS.getActivatedTypedNodes({ a: { value: 100 }, sb: { value: 95 }}, '', 96))
                    .toEqual({ a: 100 });
            });
        });
    });

    describe('set activation value', () => {
        it('should set a zero', () => {
            expect(CNS.setActivationValue({ a: { value: 100 }}, 'a', 0))
                .toEqual({ a: { value: 0 }});
        });

        it('should set a 75', () => {
            expect(CNS.setActivationValue({ a: { value: 100 }}, 'a', 75))
                .toEqual({ a: { value: 75 }});
        });

        it('should create when no-existing', () => {
            expect(CNS.setActivationValue({}, 'a', 75))
                .toEqual({ a: { value: 75 }});
        });

        it('should create the state', () => {
            expect(CNS.setActivationValue(undefined, 'a', 75))
                .toEqual({ a: { value: 75 }});
        });

        it('should keep the rest of the state', () => {
            expect(CNS.setActivationValue({ a: { value: 75, old: 80 }}, 'a', 100))
                .toEqual({ a: { value: 100, old: 80 }});
        });
    });

    describe('propagate', () => {
        it('should not crash when no concept network', () => {
            expect(CNS.propagate(null, null)).toEqual({});
        });

        it('should deactivate node without afferent links', () => {
            const cn = {
                node: [{ label: 'a', occ: 1 }, { label: 'b', occ: 1}],
                link: [{ from: 0, to: 1, coOcc: 1}]
            };
            const cns = {
                a: { value: 100 }
            };
            const res = CNS.propagate(cn, cns);
            expect(res['a'].value).toBeLessThan(100);
        });

        it('should propagate activation value', () => {
            const cn = {
                node: [{ label: 'a', occ: 1 }, { label: 'b', occ: 1}],
                link: [{ from: 0, to: 1, coOcc: 1}]
            };
            const cns = {
                a: { value: 100 }
            };
            const res = CNS.propagate(cn, cns);
            expect(res['b'].value).toBeGreaterThan(0);
        });

        it('should take decay into account', () => {
            const cn = {
                node: [{ label: 'a', occ: 1 }, { label: 'b', occ: 1}],
                link: [{ from: 0, to: 1, coOcc: 1}]
            };
            const cns = {
                a: { value: 75 },
                b: { value: 100 }
            };
            const res = CNS.propagate(cn, cns, { decay: 200 });
            expect(res).toEqual({});
        });

        it('should use decay default value', () => {
            const cn = {
                node: [{ label: 'a', occ: 1 }, { label: 'b', occ: 1}],
                link: [{ from: 0, to: 1, coOcc: 1}]
            };
            const cns = {
            };
            const res = CNS.propagate(cn, cns, { memoryPerf: 200 });
            expect(res).toEqual({});
        });
    });
});
