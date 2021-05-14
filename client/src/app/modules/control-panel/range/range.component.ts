import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

interface Range {
  from: number;
  to: number
}

@Component({
  selector: 'dyno-range',
  templateUrl: './range.component.html',
  styleUrls: ['./range.component.scss']
})
export class RangeComponent implements OnInit {
  @Output() range: EventEmitter<Range> = new EventEmitter();
  @Input() from: number = 0;
  @Input() to: number = 100;

  public fromControl = new FormControl(this.from);
  public toControl = new FormControl(this.to);

  constructor() { }

  ngOnInit(): void {
  }

}
