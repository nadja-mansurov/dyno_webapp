/// <reference types="Cypress" />


export class DisplayButtons {
    // tslint:disable-next-line:typedef
     playOnlyCheckbox() {
        return cy.get('#selectedFrames');
    }

    // tslint:disable-next-line:typedef
    hidePreviousFrames() {
        return cy.get('#hidePrevFrames');
    }

    // tslint:disable-next-line:typedef
    play() {
       return cy.get('button[title="Play"]');
    }

    // tslint:disable-next-line:typedef
    pause() {
        return cy.get('button[title="Pause"]');
    }

    // tslint:disable-next-line:typedef
    inputGroup() {
        return cy.get('.input-group');
    }

     // tslint:disable-next-line:typedef
     hideAllClouds() {
        return cy.get('button[title="Hide all clouds"]');
    }

    // tslint:disable-next-line:typedef
    selectMenu() {
        return cy.get('.form-select');
    }

     // tslint:disable-next-line:typedef
     showAllClouds() {
        return cy.get('button[title="Show all clouds"]');
    }

    // tslint:disable-next-line:typedef
    setForPlay() {
        return cy.get('button[title="Set for play"]');
    }

    // tslint:disable-next-line:typedef
    stop() {
        return cy.get('button[title="Stop"]');
    }

    // tslint:disable-next-line:typedef
    canvasDisplay() {
        return cy.get('canvas');
    }

    // tslint:disable-next-line:typedef
    hideAllCloudsCheck() {
        this.hideAllClouds()
        .click()
        .should('be.disabled');
    }

    // tslint:disable-next-line:typedef
    showAllCloudsCheck() {
        this.showAllClouds()
        .click()
        .should('be.disabled');
    }

    // tslint:disable-next-line:typedef
    selectMenuAction(Show: string , Hide: string) {
        this.selectMenu()
        .select(Show)
        .should('have.value', 'show');
        this.selectMenu()
        .select(Hide)
        .should('have.value', 'hide');
    }

    // tslint:disable-next-line:typedef
    canvasDisplayObject() {
        this.canvasDisplay()
        .trigger('mousedown', {  button: 0, pageX: 600, pageY: 100 })
        .trigger('mousemove', { which: 1, pageX: 600, pageY: 600 });
    }

    // tslint:disable-next-line:typedef
    playBtn() {
        this.play()
        .click()
        .should('be.disabled');
    }


    // ########## Frame Block ########

    // tslint:disable-next-line:typedef
    pauseBtn() {
        this.pause()
        .click()
        .should('be.disabled');
    }

    // tslint:disable-next-line:typedef
    stopBtn() {
        this.stop()
        .click()
        .should('be.disabled');
    }

    // tslint:disable-next-line:typedef
    formControlMinValues() {
        this.playOnlyCheckbox().check().should('be.checked');
        this.inputGroup().then(formControl => {
            cy.wrap(formControl).find('.form-control').eq(2).clear().type('1');
            cy.wrap(formControl).find('.form-control').eq(3).clear().type('3');
            this.play().click();
            this.setForPlay().click();
            this.stop().click({force: true});
        });
    }
    // tslint:disable-next-line:typedef
    formControlMaxValues() {
        cy.reload();
        this.hidePreviousFrames().check().should('be.checked');
        this.playOnlyCheckbox().check().should('be.checked');
        this.inputGroup().then(formControl => {
            cy.wrap(formControl).find('.form-control').eq(2).clear().type('99');
            cy.wrap(formControl).find('.form-control').eq(3).clear().type('100');
            this.play().click({force: true});
            this.setForPlay().click();
            this.stop().click({force: true});
        });
    }

}

export const displayButtons = new DisplayButtons();
