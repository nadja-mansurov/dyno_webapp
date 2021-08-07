/// <reference types="Cypress" />

export class DisplayButtons {

    getPlayButton(): any {
       return cy.get('button[title="Play"]');
    }

    getPauseButton(): any {
        return cy.get('button[title="Pause"]');
    }

    getInputGroup(): any {
        return cy.get('.input-group');
    }

     getHideAllClouds(): any {
        return cy.get('button[title="Hide all clouds"]');
    }

    getSelectMenu(): any {
        return cy.get('.form-select');
    }

    getShowAllClouds(): any {
        return cy.get('button[title="Show all clouds"]');
    }

    getSetForPlay(): any {
        return cy.get('button[title="Set for play"]');
    }

    getStopButton(): any {
        return cy.get('button[title="Stop"]');
    }

    getCanvasDisplay(): any {
        return cy.get('canvas');
    }
}
export const displayButtons = new DisplayButtons();
