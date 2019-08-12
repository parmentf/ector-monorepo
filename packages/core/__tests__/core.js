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
                            beg: 1,
                            end: 1
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
                            beg: 1
                        },
                        {
                            label: 'w{yourname}.',
                            occ: 1,
                            end: 1
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

    describe('generate response', () => {
        it('should yield a minimal response', () => {
            const ector = {
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
                            beg: 1,
                            end: 1
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
            };
            expect(ECTOR.generateResponse(ector)).toHaveProperty('response', 'Hello.');
            expect(ECTOR.generateResponse(ector)).toHaveProperty('responseLabels', ['wHello.']);
        });
    });

    describe('link nodes to last sentence', () => {
        it('should not create links when no lastSentenceNode exist', function () {
            /** @type ECTOR.ECTOR */
            let ector = ECTOR.addEntry({}, "Hello.");
            const previousLinksNb = ector.cn.link.length;
            ector = { ...ector, lastSentenceLabel: null };
            ector = ECTOR.linkNodesToLastSentence(ector, ['wHello.']);
            expect(ector.cn.link.length).toBe(previousLinksNb);
        });

        it('should not create link when [] is given', function () {
            /** @type ECTOR.ECTOR */
            let ector = ECTOR.addEntry({}, "Hello.");
            const previousLinksNb = ector.cn.link.length;
            ector = ECTOR.linkNodesToLastSentence(ector, []);
            expect(ector.cn.link.length).toBe(previousLinksNb);
        });

        it('should create links', function () {
            /** @type ECTOR.ECTOR */
            let ector = ECTOR.addEntry({}, "Hello.");
            const previousLinksNb = ector.cn.link.length;
            ector = ECTOR.linkNodesToLastSentence(ector, ['wHello.']);
            expect(ector.cn.link.length).toBeGreaterThan(previousLinksNb);

            // 1 link from sentenceNode to the only tokenNode
            // sHello. (1) -> wHello. (2)
        });
    });

    describe('get response', () => {
        it('should return the last generated response', () => {
            /** @type ECTOR.ECTOR */
            let ector = ECTOR.addEntry({}, "Hello.");
            ector = ECTOR.generateResponse(ector);
            expect(ECTOR.getResponse(ector)).toBe('Hello.');
        });

        it('should return empty string when no response was generated', () => {
            /** @type ECTOR.ECTOR */
            let ector = ECTOR.addEntry({}, "Hello.");
            expect(ECTOR.getResponse(ector)).toBe('');
        });
    });
});
