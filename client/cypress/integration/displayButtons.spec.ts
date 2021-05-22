/// <reference types="Cypress" />


import { displayButtons } from '../page-object/displayButtons';

describe('Tests of display buttons', () => {

    beforeEach(() => {
        cy.visit('/');
    });

    it('Should click the display buttons', () => {
        displayButtons.hideAllClouds();
        displayButtons.showAllClouds();
    });

    it('Should check the select menu', () => {
        displayButtons.selectMenu('Show', 'Hide');
    });
});