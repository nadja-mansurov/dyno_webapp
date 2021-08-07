/// <reference types="Cypress" />

import { checkboxes } from '@cypress/page-object/checkboxes';

describe('Test of checkboxes', () => {

    beforeEach(() => {
        cy.visit('/');
    });

    it('should check the checkboxes', () => {
        checkboxes.getUploadCustomFilesCheckbox().check().should('be.checked');
        checkboxes.getHidePreviousFramesCheckbox().check().should('be.checked');
        checkboxes.getPlayOnlyCheckbox().check().should('be.checked');
        checkboxes.getShowHelpCheckbox().check().should('be.checked');
        checkboxes.getLogicalContainer().eq(4).should('be.visible');
    });
});




