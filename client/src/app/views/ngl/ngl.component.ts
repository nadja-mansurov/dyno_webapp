import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

const URI = 'rcsb://'

@Component({
  selector: 'dyno-ngl',
  templateUrl: './ngl.component.html',
  styleUrls: ['./ngl.component.scss']
})
export class NglComponent implements OnInit {
  public fileAddressInput = new FormControl('');
  public visualizedId = "1CRN";
  public isFailed = false;

  private fileAddress = "1CRN";
  private Stage: any;
  private stageInstance: any;

  constructor() {
    // TODO: check update https://github.com/nglviewer/ngl,
    // Stage has to be imported from node_modules
    this.Stage = (<any>window).NGL.Stage;
  }

  ngOnInit(): void {
    this.fileAddressInput.setValue(this.fileAddress);
    this.stageInstance = new this.Stage("viewport");
    this.stageInstance.loadFile(URI + this.fileAddress, {defaultRepresentation: true});
  }

  visualize() {
    this.fileAddress = this.fileAddressInput.value;
    this.stageInstance.loadFile(URI + this.fileAddress, {defaultRepresentation: true})
      .then((t: any) => {
        this.visualizedId = t.parameters.name;
        this.isFailed = false;
      })
      .catch(() => {
        this.isFailed = true;
      });
  }

}
