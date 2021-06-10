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

    it('Should check the buttons block', () => {
        displayButtons.playBtn();
        displayButtons.pauseBtn();
        displayButtons.stopBtn();

    });
});
