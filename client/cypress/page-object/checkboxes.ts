/// <reference types="Cypress" />

export class Checkboxes {

    getUploadCustomFilesCheckbox(): any{
        return cy.get('input#customFiles');
    }

    getHidePreviousFramesCheckbox(): any {
        return cy.get('#hidePrevFrames');
    }

    getPlayOnlyCheckbox(): any {
       return cy.get('#selectedFrames');
    }

    getShowHelpCheckbox(): any {
        return cy.get('#helpShow');
    }

    getLogicalContainer(): any {
        return cy.get('.logical-container');
    }
}
export const checkboxes = new Checkboxes();
