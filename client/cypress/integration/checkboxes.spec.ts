/// <reference types="Cypress" />


import { checkboxes } from '@cypress/page-object/checkboxes';



describe('Test of checkboxes', () => {

    beforeEach(() => {
        cy.visit('/');
    });

    it('should check the checkboxes', () => {
        checkboxes.uploadCustomFiles();
        checkboxes.hidePreviousFrames();
        checkboxes.playOnly();
    });
});




