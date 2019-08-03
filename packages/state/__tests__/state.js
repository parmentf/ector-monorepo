'use strict';

import * as CN from '@ector/concept-network';
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
});
