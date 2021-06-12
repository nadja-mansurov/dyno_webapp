/// <reference types="Cypress" />


import { displayButtons } from '../page-object/displayButtons';

describe('Tests of display buttons', () => {

    beforeEach(() => {
        cy.visit('/');
    });

    it('Should click the display buttons and trigger of display object', () => {
        displayButtons.canvasDisplayObject();
        displayButtons.hideAllClouds();
        displayButtons.showAllClouds();
    });

    it('Should check the select menu', () => {
        displayButtons.selectMenu('Show', 'Hide');
    });

    it.only('Should check the buttons Frame block', () => {
        displayButtons.playBtn();
        displayButtons.pauseBtn();
        displayButtons.stopBtn();
        displayButtons.formControlMinValues();
        displayButtons.formControlMaxValues();
    });
});
