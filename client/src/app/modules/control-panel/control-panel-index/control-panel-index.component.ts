import { Component, OnInit } from '@angular/core';
import { FilesService } from '@/app/services/files.service';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

import { AppState } from '@/app/reducers';
import { DisplayActions, PlayerActions } from '@/app/actions/action-types';
import { isDisplayAll } from '@/app/selectors/display.selector';
import { SubSink } from 'subsink';
import { playSelector, hidePastSelector, currentFrameSelector } from '@/app/selectors/play.selector';

@Component({
  selector: 'dyno-control-panel-index',
  templateUrl: './control-panel-index.component.html',
  styleUrls: ['./control-panel-index.component.scss']
})
export class ControlPanelIndexComponent implements OnInit {
  public allowToDraw: boolean = false;
  public playStatus: 'stop'|'pause'|'play' = 'stop';

  public uploadCustom: boolean = false;
  public hidePast: boolean = false;
  public playSelected: boolean = false;
  public currentFrame: string = 'All';

  public selectedParams: boolean = false;
  public rangeType: 'show'|'hide'|null = null;
  public playRange: number[]= [];
  public showRange: number[]= [];

  public displayAll$: Observable<'show'|'hide'|null>;

  public playStatus$: Observable<'stop'|'pause'|'play'>;
  public hidePastStatus$: Observable<boolean>;
  public currentFrame$: Observable<number|null>;

  private subs = new SubSink();

  constructor(
    private store: Store<AppState>,
    private _filesService: FilesService
  ) {
    this.displayAll$ = this.store.pipe(select(isDisplayAll));
    this.playStatus$ = this.store.pipe(select(playSelector));
    this.hidePastStatus$ = this.store.pipe(select(hidePastSelector));
    this.currentFrame$ = this.store.pipe(select(currentFrameSelector));
  }

  ngOnInit(): void {
    this.currentFrame$.subscribe(currentFrame => {
      if (currentFrame || currentFrame === 0) {
        this.currentFrame = currentFrame.toString();
      } else {
        this.currentFrame = 'All';
      }
    });

    this.hidePastStatus$.subscribe(status => {
      this.hidePast = status;
    });

  }

  public setCloudVisibility(visibility: 'hide'|'show') {
    this.store.dispatch(DisplayActions.setAll({ all: visibility }));
  }

  public draw() {

  }

  public play(status: 'play'|'pause'|'stop') {
    this.store.dispatch(PlayerActions.setPlay({ playStatus: status }));
  }

  public setFilesOption() {
    this.uploadCustom = !this.uploadCustom;
    this._filesService.setCustom(this.uploadCustom);
  }

  public setHideShowRange($event: any) {
    console.log('setHideShowRange', $event);
    if ($event) {
      this.showRange = [$event.from, $event.to];
    } else {
      this.showRange = [];
    }
  }

  public setHidePast() {
    this.hidePast = !this.hidePast;
    this.store.dispatch(PlayerActions.setHidePast({ hidePast: this.hidePast }));
  }

  public setHideShowType($event: any) {
    this.rangeType = <'show'|'hide'|null>$event;
  }

  public setSelectedRange() {
    this.store.dispatch(DisplayActions.setRangeSelected({ range: this.showRange, selected: this.rangeType }));
  }

  public setPlayedRange() {
    console.log('setPlayedRange');
    this.store.dispatch(PlayerActions.setRange({ range: this.playRange }));
  }

  public setPlayRange($event: any) {
    console.log('setPlayRange', $event);
    if ($event) {
      this.playRange = [$event.from, $event.to];
    } else {
      this.playRange = [];
    }
  }
}
