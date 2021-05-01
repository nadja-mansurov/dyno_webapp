import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'dyno-dynophores-main',
  templateUrl: './dynophores-main.component.html',
  styleUrls: ['./dynophores-main.component.scss']
})
export class DynophoresMainComponent implements OnInit {
  hasHidden = false;
  cloudsVisibility = true;
  hiddenFrames: Array<number> = [];
  hidden = [];

  constructor() { }

  ngOnInit(): void {
  }

  setHiddenFrames($event: Array<Array<number>>) {
    console.log($event);
    this.hiddenFrames = [];
    $event.map(item => {
      if (item.length > 0) {
        for (let i = item[0]; i < item[1]; i++) {
          this.hiddenFrames.push(i);
        }
      }
    })
  }

  setCloudsVisibility($event: any) {
    this.cloudsVisibility = $event;
  }

}
