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

    // tslint:disable-next-line:typedef
    playBtn() {
        cy.get('button[title="Play"]')
        .click()
        .should('be.disabled');
    }


    // ########## Frame Block ########

    // tslint:disable-next-line:typedef
    pauseBtn() {
        cy.get('button[title="Pause"]')
        .click()
        .should('be.disabled');
    }

    // tslint:disable-next-line:typedef
    stopBtn() {
        cy.get('button[title="Stop"]')
        .click()
        .should('be.disabled');
    }

    // tslint:disable-next-line:typedef
    playOnlyCheckbox() {
        cy.get('#selectedFrames').check();
    }

    // tslint:disable-next-line:typedef
    formControl() {
        cy.get('.form-control')
        .eq(2)
        .clear()
        .type('1');
        cy.get('.form-control')
        .eq(3)
        .clear()
        .type('3');
    }
}

export const displayButtons = new DisplayButtons();
