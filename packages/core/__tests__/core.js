'use strict';

import * as ECTOR from '../src/core';

describe('@ector/core', () => {
    describe('names', () => {
        it('should give default name', () => {
            expect(ECTOR.addEntry({}, 'Test')).toHaveProperty('name', 'ECTOR');
        });

        it('should give default username', () => {
            expect(ECTOR.addEntry({}, 'Test')).toHaveProperty(
                'username',
                'Guy',
            );
        });

        it('should accept given name', () => {
            expect(ECTOR.addEntry({ name: 'Achille' }, 'Test')).toHaveProperty(
                'name',
                'Achille',
            );
        });

        it('should accept given username', () => {
            expect(ECTOR.addEntry({ username: 'Dan' }, 'Test')).toHaveProperty(
                'username',
                'Dan',
            );
        });
    });

    describe('addEntry', () => {
        it('should add entry in the model', () => {
            expect(ECTOR.addEntry({}, `Hello.`)).toEqual({
                name: 'ECTOR',
                username: 'Guy',
                cn: {
                    node: [
                        {
                            label: 'sHello.',
                            occ: 1,
                        },
                        {
                            label: 'wHello.',
                            occ: 1,
                        },
                    ],
                    link: [{ from: 0, to: 1, coOcc: 1 }],
                },
                cns: {
                    Guy: {
                        'sHello.': { value: 100 },
                        'wHello.': { value: 100 },
                    },
                },
                lastSentenceLabel: 'sHello.',
                lastTokenLabels: ['wHello.'],
            });
        });

        it('should link sequential tokens', () => {
            expect(ECTOR.addEntry({}, `Hello ECTOR.`)).toEqual({
                name: 'ECTOR',
                username: 'Guy',
                cn: {
                    node: [
                        {
                            label: 'sHello {yourname}.',
                            occ: 1,
                        },
                        {
                            label: 'wHello',
                            occ: 1,
                        },
                        {
                            label: 'w{yourname}.',
                            occ: 1,
                        },
                    ],
                    link: [
                        {
                            from: 0,
                            to: 1,
                            coOcc: 1,
                        },
                        {
                            from: 0,
                            to: 2,
                            coOcc: 1,
                        },
                        {
                            from: 1,
                            to: 2,
                            coOcc: 1,
                        },
                    ],
                },
                cns: {
                    Guy: {
                        'sHello {yourname}.': { value: 100 },
                        wHello: { value: 100 },
                        'w{yourname}.': { value: 100 },
                    },
                },
                lastSentenceLabel: 'sHello {yourname}.',
                lastTokenLabels: ['wHello', 'w{yourname}.'],
            });
        });
    });
});
