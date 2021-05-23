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

    // tslint:disable-next-line:typedef
    canvasDisplayObject() {
        cy.get('canvas')
        .trigger('mousedown', {  button: 0, pageX: 600, pageY: 100 })
        .trigger('mousemove', { which: 1, pageX: 600, pageY: 600 });
    }
}

export const displayButtons = new DisplayButtons();
