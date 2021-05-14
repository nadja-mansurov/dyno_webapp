import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'dyno-control-panel-index',
  templateUrl: './control-panel-index.component.html',
  styleUrls: ['./control-panel-index.component.scss']
})
export class ControlPanelIndexComponent implements OnInit {
  public allowToDraw: boolean = false;
  public isPlay: boolean = false;

  public uploadCustom: boolean = false;
  public playSelected: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  public setCloudVisibility(visibility: boolean) {

  }

  public draw() {

  }

  public play(isPlay: boolean) {

  }
}
