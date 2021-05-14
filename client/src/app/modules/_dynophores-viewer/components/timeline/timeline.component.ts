import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ControlsService } from '../../services/controls.service';

@Component({
  selector: 'dyno-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements OnInit {
  @Output() setPlayingFrames: EventEmitter<any> = new EventEmitter();
  from = new FormControl(2);
  to = new FormControl(20);
  allShown = true;

  constructor(
    private _controlsService: ControlsService
  ) { }

  ngOnInit(): void {
  }

  playSelected(isHide: boolean) {
    if (isHide) {
      this.allShown = false;
      this._controlsService.setPlayingInterval([this.from.value, this.to.value]);
    } else {
      this.allShown = true;
      this._controlsService.setPlayingInterval(null);
    }

  }
}
