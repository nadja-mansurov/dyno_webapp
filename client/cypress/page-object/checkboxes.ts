/// <reference types="Cypress" />

export class Checkboxes {
    // tslint:disable-next-line:typedef
    inputCustomFiles() {
        return cy.get('input#customFiles');
    }

    // tslint:disable-next-line:typedef
    hidePreviousFramesCheckbox() {
        return cy.get('#hidePrevFrames');
    }

    // tslint:disable-next-line:typedef
    playOnlyCheckbox() {
       return cy.get('#selectedFrames');
    }
    // tslint:disable-next-line:typedef
    uploadCustomFiles() {
        this.inputCustomFiles()
        .check()
        .should('be.checked');
    }

    // tslint:disable-next-line:typedef
    hidePreviousFrames() {
        this.hidePreviousFramesCheckbox()
        .check()
        .should('be.checked');
    }

    // tslint:disable-next-line:typedef
    playOnly() {
        this.playOnlyCheckbox()
        .check()
        .should('be.checked');
    }

}
// tslint:disable-next-line:eofline
export const checkboxes = new Checkboxes();