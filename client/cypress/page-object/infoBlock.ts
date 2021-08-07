/// <reference types="Cypress" />

export class InfoBlock {

    getInfoBlock(): any {
        return cy.get('.info-block');
    }
}

export const infoBlock = new InfoBlock();
