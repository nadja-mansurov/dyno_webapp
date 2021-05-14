/// <reference types="Cypress" />

export class Checkboxes {

    // tslint:disable-next-line:typedef
    uploadCustomFiles() {
        cy.get('#customFiles').check();
    }


}

// tslint:disable-next-line:eofline
export const checkboxes = new Checkboxes();