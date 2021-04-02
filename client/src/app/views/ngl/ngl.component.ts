import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'dyno-ngl',
  templateUrl: './ngl.component.html',
  styleUrls: ['./ngl.component.scss']
})
export class NglComponent implements OnInit {
  private Stage: any;

  constructor() {
    // TODO: check update https://github.com/nglviewer/ngl,
    // Stage has to be imported from node_modules
    this.Stage = (<any>window).NGL.Stage;
  }

  ngOnInit(): void {
    let stage = new this.Stage("viewport");
    stage.loadFile("rcsb://1crn", {defaultRepresentation: true});
  }

}
