# Test plan of [dyno_webapp](https://github.com/nadja-mansurov/dyno_webapp) #

## Introduction ##
  
Web interface for the visualization dynamics of a protein-ligand complex and dynophores (dynamic pharmacophores). 
This technique is used for in silico drug discovery.

## Scope of Work ##

Test Object: dyno_webapp

## Expected testing ##

#### For individual fields: ####

* Positive testing of the application (correct steps, correct data)
* Negative testing (involves the introduction of incorrect data)

#### For the entire application: ####

* Functional testing
* Testing the user interface

#### Test environment: ####

* Browser: Chrome
* Automated tool: Cypress

#### Tested functionality: ####

* Upload custom files block -  high priority 
(The uploading files as PML, PDB, DCD;  Functionality of buttons, checkbox)
* Clouds block -  high priority 
(Functionality of buttons;  The data entry to individual fields;  Drop-down menu: choosing items)
* Frame block -  high priority 
(Functionality of buttons, checkboxes; The data entry to individual fields)
* Show help block – low priority 
(Checking checkbox; Checking text on pop-up window)
* Display of Application – high priority

Load and security testing will not be carried out due to the lack of necessary resources
      
## Quality and Acceptance Criteria ##
#### Criteria for starting and ending testing ####

Testing can be started if the following conditions are completed:

* The necessary documentation is ready and approved
* The test functionality is finished and ready for transfer to testing

Testing is finished if the following conditions are completed:

* All the found defects are documented

#### Critical Success Factors ####



#### Risk Assessment: ####



## Resources ##

* QA Team: 1 Software Tester
* Automated testing: Cypress automated tool
* CI/CD: GitHub Actions
* Test environment: Chrome Browser

## Test Documentation ##

After the end of testing, it is planned to have such documents:

* Test plan [Artem Tarasov](https://github.com/TarasovArtem)
* Check list [Artem Tarasov](https://github.com/TarasovArtem)
* Test cases [Artem Tarasov](https://github.com/TarasovArtem)
* Bug reports [Artem Tarasov](https://github.com/TarasovArtem)
