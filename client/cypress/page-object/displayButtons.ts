/// <reference types="Cypress" />


export class DisplayButtons {
    // tslint:disable-next-line:typedef
    hideAllClouds() {
        cy.get('button[title="Hide all clouds"]').click();
    }

    // tslint:disable-next-line:typedef
    showAllClouds() {
        cy.get('button[title="Show all clouds"]').click();
    }

    // tslint:disable-next-line:typedef
    selectMenu(Show: string | string[], Hide: string | string[]) {
        cy.get('.form-select')
        .select(Show);
        cy.get('.form-select')
        .select(Hide);

    }
}

export const displayButtons = new DisplayButtons();
