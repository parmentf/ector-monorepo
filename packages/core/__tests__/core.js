'use strict';

import * as ECTOR from '../src/core';

describe('@ector/core', () => {
    describe('addEntry', () => {
        it('should in the model', () => {
            expect(ECTOR.addEntry({
                username: 'Guy'
            }, `Hello.`))
            .toEqual({
                name: 'ECTOR',
                username: 'Guy',
                cn: {
                    node: [{
                        label: 'sHello.',
                        occ: 1
                    }, {
                        label: 'wHello.',
                        occ: 1
                    }],
                    link: [{ from: 0, to: 1, coOcc: 1 }]
                },
                cns: {
                    Guy: {
                        'sHello.': { value: 100 },
                        'wHello.': { value: 100 }
                     }
                },
                lastSentenceLabel: 'sHello.',
                lastTokenLabels: ['wHello.']
            })
        });
    });
});
