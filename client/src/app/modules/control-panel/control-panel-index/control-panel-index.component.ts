import { Component, OnInit } from '@angular/core';
import { FilesService } from '@/app/services/files.service';
import { SubSink } from 'subsink';
import { Store, select } from '@ngrx/store';
import { Observable, of } from 'rxjs';

import { FILE_TYPES } from '@/app/const/fileTypes.const';
import { AppState } from '@/app/reducers';
import { DisplayActions, PlayerActions, FilesActions } from '@/app/actions/action-types';

import { isDisplayAll } from '@/app/selectors/display.selector';
import { playSelector, hidePastSelector, currentFrameSelector } from '@/app/selectors/play.selector';
import { isReadyToDraw } from '@/app/selectors/files.selector';
import { tabSelected } from '@/app/selectors/tab.selector';



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

  public tabSelected$: Observable<'ngl'|'chart'>;
  public displayAll$: Observable<'show'|'hide'|null>;

  public playStatus$: Observable<'stop'|'pause'|'play'>;
  public hidePastStatus$: Observable<boolean>;
  public currentFrame$: Observable<number|null>;
  public fileTypes: Array<"pdb" | "pml" | "dcd"> = [];

  public isReadyToDraw$: Observable<boolean>

  private subs = new SubSink();


  constructor(
    private store: Store<AppState>,
    private _filesService: FilesService
  ) {
    this.displayAll$ = this.store.pipe(select(isDisplayAll));
    this.playStatus$ = this.store.pipe(select(playSelector));
    this.hidePastStatus$ = this.store.pipe(select(hidePastSelector));
    this.currentFrame$ = this.store.pipe(select(currentFrameSelector));
    this.isReadyToDraw$ = this.store.pipe(select(isReadyToDraw));
    this.tabSelected$ = this.store.pipe(select(tabSelected));
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

    Object.keys(FILE_TYPES).map(item => {
      this.fileTypes.push(<"pdb" | "pml" | "dcd">item);
    });
  }

  public setCloudVisibility(visibility: 'hide'|'show') {
    this.store.dispatch(DisplayActions.setAll({ all: visibility }));
  }

  public setFile($event: any, type: 'pdb' | 'pml' | 'dcd') {
    this.store.dispatch(FilesActions.setFile({
      blob: $event,
      fileType: <'pdb' | 'pml' | 'dcd'>type
    }));
  }

  public removeAll() {
    this.fileTypes = [];
    this.store.dispatch(FilesActions.removeFiles());
    // TODO: clear without rerendering component
    setTimeout(() => {
      Object.keys(FILE_TYPES).map(item => {
        this.fileTypes.push(<"pdb" | "pml" | "dcd">item);
      });
    }, 100);
  }

  public draw() {
    this._filesService.updateFiles(true);
  }

  public play(status: 'play'|'pause'|'stop') {
    this.store.dispatch(PlayerActions.setPlay({ playStatus: status }));
  }

  public setFilesOption() {
    this.uploadCustom = !this.uploadCustom;
    this._filesService.setCustom(this.uploadCustom);
    if (!this.uploadCustom) {
      this._filesService.updateFiles(false);
    }
  }

  public setHideShowRange($event: any) {
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
    this.store.dispatch(PlayerActions.setRange({ range: this.playRange }));
  }

  public setPlayRange($event: any) {
    if ($event) {
      this.playRange = [$event.from, $event.to];
    } else {
      this.playRange = [];
    }
  }
}
