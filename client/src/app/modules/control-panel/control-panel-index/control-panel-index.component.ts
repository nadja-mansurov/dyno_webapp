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

  public selectedParams: boolean = false;
  public rangeType: 'show'|'hide'|null = null;
  public playRange: number[]= [];

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
      this.playRange = [$event.from, $event.to];
    } else {
      this.playRange = [];
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
    console.log('setSelectedRange');
    this.store.dispatch(DisplayActions.setRangeSelected({ range: this.playRange, selected: this.rangeType }));
  }
}
