/// <reference types="Cypress" />

import { displayButtons } from '@cypress/page-object/displayButtons';
import { checkboxes } from '@cypress/page-object/checkboxes';

describe('Tests of Display actions, buttons, menu and input group with different values', () => {

    beforeEach(() => {
        cy.visit('/');
    });

    it('Should click the display buttons and trigger of display object', () => {
        displayButtons.getCanvasDisplay()
            .trigger('mousedown', {  button: 0, pageX: 600, pageY: 100 })
            .trigger('mousemove', { which: 1, pageX: 600, pageY: 600 });
        displayButtons.getHideAllClouds().click().should('be.disabled');
        displayButtons.getShowAllClouds().click().should('be.disabled');
    });

    it('Should check the select menu', () => {
        displayButtons.getSelectMenu().select('Show').should('have.value', 'show');
        displayButtons.getSelectMenu().select('Hide').should('have.value', 'hide');
    });

    it('Should check the buttons Frame block', () => {
        displayButtons.getPlayButton().click().should('be.disabled');
        displayButtons.getPauseButton().click().should('be.disabled');
        displayButtons.getStopButton().click().should('be.disabled');
    });

    it('Should check input group of the Frame block with min values ', () => {
        checkboxes.getPlayOnlyCheckbox().check().should('be.checked');
        displayButtons.getInputGroup().then((formControlMinValues: any) => {
            cy.wrap(formControlMinValues).find('.form-control').eq(2).clear().type('1');
            cy.wrap(formControlMinValues).find('.form-control').eq(3).clear().type('3');
        });
        displayButtons.getPlayButton().click();
        displayButtons.getSetForPlay().click();
        displayButtons.getStopButton().click({force: true});
        cy.reload();
    });

    it('Should check input group of the Frame block with max values ', () => {
        checkboxes.getPlayOnlyCheckbox().check().should('be.checked');
        displayButtons.getInputGroup().then((formControlMaxValues: any) => {
            cy.wrap(formControlMaxValues).find('.form-control').eq(2).clear().type('99');
            cy.wrap(formControlMaxValues).find('.form-control').eq(3).clear().type('100');
        });
        displayButtons.getPlayButton().click();
        displayButtons.getSetForPlay().click();
        displayButtons.getStopButton().click({force: true});
    });
});
