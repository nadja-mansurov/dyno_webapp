/// <reference types="Cypress" />

export class Checkboxes {

    // tslint:disable-next-line:typedef
    uploadCustomFiles() {
        cy.get('input#customFiles')
        .check()
        .should('be.checked');
    }

    // tslint:disable-next-line:typedef
    hidePreviousFrames() {
        cy.get('#hidePrevFrames')
        .check()
        .should('be.checked');
    }

    // tslint:disable-next-line:typedef
    playOnly() {
        cy.get('#selectedFrames')
        .check()
        .should('be.checked');
    }

}
// tslint:disable-next-line:eofline
export const checkboxes = new Checkboxes();