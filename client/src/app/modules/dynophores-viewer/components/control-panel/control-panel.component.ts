import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'dyno-control-panel',
  templateUrl: './control-panel.component.html',
  styleUrls: ['./control-panel.component.scss']
})
export class ControlPanelComponent implements OnInit {
  @Output() getCloudVisibility: EventEmitter<boolean> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  setCloudVisibility(val: boolean) {
    this.getCloudVisibility.emit(val);
  }

}
