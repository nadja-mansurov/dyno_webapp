import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'dyno-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements OnInit {
  @Output() setHiddenFrames: EventEmitter<any> = new EventEmitter();
  from = new FormControl(2);
  to = new FormControl(20);
  allShown = true;

  constructor() { }

  ngOnInit(): void {
  }

  hide(isHide: boolean) {
    if (isHide) {
      this.allShown = false;
      this.setHiddenFrames.emit([[this.from.value, this.to.value]]); // array of arrays [from, to]-hidden
    } else {
      this.allShown = true;
      this.setHiddenFrames.emit([]);
    }

  }
}
