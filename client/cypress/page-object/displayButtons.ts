/// <reference types="Cypress" />


export class DisplayButtons {
    // tslint:disable-next-line:typedef
    hideAllClouds() {
        cy.get('button[title="Hide all clouds"]')
        .click()
        .should('be.disabled');
    }

    // tslint:disable-next-line:typedef
    showAllClouds() {
        cy.get('button[title="Show all clouds"]')
        .click()
        .should('be.disabled');
    }

    // tslint:disable-next-line:typedef
    selectMenu(Show: string | string[], Hide: string | string[]) {
        cy.get('.form-select')
        .select(Show)
        .should('have.value', 'show');
        cy.get('.form-select')
        .select(Hide)
        .should('have.value', 'hide');

    }
}

export const displayButtons = new DisplayButtons();
