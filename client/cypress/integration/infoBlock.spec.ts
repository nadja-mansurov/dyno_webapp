/// <reference types="Cypress" />

import { infoBlock } from '@cypress/page-object/infoBlock';

describe('Test of Info Block', () => {

    beforeEach(() => {
        cy.visit('/');
    });

    it('should show the Info Block', () => {
        infoBlock.getInfoBlock().should('be.visible');
    });
});
