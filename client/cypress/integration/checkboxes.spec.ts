/// <reference types="Cypress" />


import { checkboxes } from '../page-object/checkboxes';



describe('Checkboxes', () => {

    beforeEach(() => {
        cy.visit('/');
    });

    it('first start', () => {
        checkboxes.uploadCustomFiles();
    });

});




