import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Observable, interval, asyncScheduler } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { SubSink } from 'subsink';

import { NGL } from '@/app/const/ngl.const';
import { ParserService } from '@/app/services/parser.service';
import { FilesService } from '@/app/services/files.service';

import { AppState } from '@/app/reducers';
import { isDisplayAll, isDisplaySelected, getRange } from '@/app/selectors/display.selector';
import { globalMax, globalMin } from '@/app/selectors/files.selector';
import { playSelector, currentFrameSelector, hidePastSelector, rangeSelector } from '@/app/selectors/play.selector';
import { PlayerActions, DisplayActions, SelectionActions } from '@/app/actions/action-types';
import { DynophoreAtomModel } from '@/app/models/dynophore-atom.model';
import { TIMEOUT } from 'dns';


const PLAYER_TIMEOUT = 500;

@Component({
  selector: 'dyno-ngl-index',
  templateUrl: './ngl-index.component.html',
  styleUrls: ['./ngl-index.component.scss']
})
export class NglIndexComponent implements OnInit, OnDestroy, AfterViewInit {

  private atomsCoordsList: DynophoreAtomModel[] = [];
  private stageInstance: any;
  private subs = new SubSink();
  private structureComponent: any;
  private trajectoryStructureComponent: any;

  private dynophore: any;
  private dynophoreShapes: any;
  private shapeComponents: any = {};
  private player: any;
  private currentFrame: number|null = null;

  private range: number[] = [0, 100];
  private isSelected: 'show'|'hide'|null = null;
  private globalMax = 0;
  private globalMin = 0;
  private playStatus: 'play'|'pause'|'stop' = 'stop';
  private interval: any;
  private isPrevHidden = true;
  private playRange = [0, 100];

  private displayAll$: Observable<'show'|'hide'|null>;
  private isDisplaySelected$: Observable<'show'|'hide'|null>;
  private isRange$: Observable<number[]|null>;
  private playStatus$: Observable<'play'|'pause'|'stop'>;
  private hidePast$: Observable<boolean>;
  private playRange$: Observable<number[]|null>;
  private currentFrame$: Observable<number|null>;

  private globalMax$: Observable<number>;
  private globalMin$: Observable<number>;

  constructor(
    private store: Store<AppState>,
    private filesService: FilesService,
    private parserService: ParserService
  ) {
    this.displayAll$ = this.store.pipe(select(isDisplayAll));
    this.isDisplaySelected$ = this.store.pipe(select(isDisplaySelected));
    this.isRange$ = this.store.pipe(select(getRange));
    this.globalMax$ = this.store.pipe(select(globalMax));
    this.globalMin$ = this.store.pipe(select(globalMin));

    this.playStatus$ = this.store.pipe(select(playSelector));
    this.currentFrame$ = this.store.pipe(select(currentFrameSelector));
    this.hidePast$ = this.store.pipe(select(hidePastSelector));
    this.playRange$ = this.store.pipe(select(rangeSelector));

  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  ngAfterViewInit() {
    asyncScheduler.schedule(() => {
      this.stageInstance = new NGL.Stage('viewport');

      this.subs.sink = this.filesService.isCustom$.subscribe(isCustom => {
        this.clearStage(isCustom);
        this.initPdbDcd(isCustom);
      })
      this.storeSubscription();

    }, PLAYER_TIMEOUT);
  }

  private initPdbDcd(isCustom?: boolean) {
    this.subs.sink = this.filesService.uploadPdb(this.stageInstance, isCustom).pipe(
      switchMap(pdb => {
        this.structureComponent =
            this.parserService.structureDrawing(pdb, this.stageInstance);

        this.stageInstance.signals.clicked.add(this.stageClicked, this);
        return this.filesService.uploadDcd(isCustom);
      }),
      switchMap((dcdFile: any) => {
        this.trajectoryStructureComponent = this.structureComponent.addTrajectory(dcdFile, {
          deltaTime: PLAYER_TIMEOUT,
          timeOffset: 0,
          removePeriodicity: false,
          centerPbc: false,
          remo: false,
          superpose: false
        })

        this.trajectoryStructureComponent.signals.frameChanged.add(this.frameChangedListener, this);

        return this.filesService.uploadPml(isCustom)
      })
    ).subscribe((pmlRaw: any) => {
      this.dynophore = this.parserService.parseDynophore(pmlRaw);
      this.atomsCoordsList =
        this.parserService.getAtomDynophoreInteractions(this.dynophore.allInvolvedAtoms, this.structureComponent);
      this.drawCloud();
      this.structureComponent.autoView();
      this.playerInit();
    });
  }

  private drawCloud() {
    this.dynophoreShapes = this.parserService.dynophoreDrawing(this.dynophore);
    this.showDynophore();
  }

  private showDynophore() {
    Object.keys(this.dynophoreShapes).map((shapeId, i) => {
      this.shapeComponents[shapeId] = this.stageInstance.addComponentFromObject(this.dynophoreShapes[shapeId]);
      this.shapeComponents[shapeId].addRepresentation('buffer', { opacity: 0.9 });
    });
  }

  private removeDynophore() {
    Object.keys(this.dynophoreShapes).map(shapeId => {
      this.stageInstance.removeComponent(this.shapeComponents[shapeId]);
    });
  }

  private toggleSelected(isAll?: 'show'|'hide') {
    this.removeDynophore();
    if (this.isSelected) {
      const range = this.parserService.getShowingIndecies(this.range, this.isSelected, this.globalMin, this.globalMax);
      this.dynophoreShapes = this.parserService.dynophoreDrawingByVisible(this.dynophore, range);
      this.showDynophore();
    } else if (isAll) {
      const range = this.parserService.getShowingIndecies([this.globalMin, this.globalMax], isAll, this.globalMin, this.globalMax);
      this.dynophoreShapes = this.parserService.dynophoreDrawingByVisible(this.dynophore, range);
      this.showDynophore();
    }
  }

  private playDynophore(currentFrame: number) {
    if (!currentFrame) return;
    let range = [currentFrame];
    this.removeDynophore();
    if (!this.isPrevHidden) {
      range = [];
      for (let i = this.playRange[0]; i <= currentFrame; i++) {
        range.push(i);
      }
    }

    const atomCoords = this.parserService.parseAtomCoord(this.structureComponent.structure.getAtomData());

    this.dynophoreShapes = this.parserService.dynophoreDrawingByVisible(this.dynophore, range, atomCoords);

    Object.keys(this.dynophoreShapes).map((shapeId, i) => {
      this.shapeComponents[shapeId] = this.stageInstance.addComponentFromObject(this.dynophoreShapes[shapeId]);
      this.shapeComponents[shapeId].addRepresentation('buffer', { opacity: 0.9 });
    });
  }

  private togglePlayer(playStatus: 'play'|'pause'|'stop') {
    if (playStatus === 'play') {
      if (this.playRange[0] && this.playRange[0] !== this.globalMin) {
        this.player.setParameters({
          start: this.playRange[0] - 1
        });
      }
      if (this.playRange[1] && this.playRange[1] !== this.globalMax) {
        this.player.setParameters({
          end: this.playRange[1]
        });
      }
      this.player.play();
    } else if (playStatus === 'pause') {
      this.player.pause();
    } else if (playStatus === 'stop') {
      this.player.stop();
      this.toggleSelected('show');
    }

  }

  private playerInit() {
    this.stageInstance.eachComponent((item: any) => {
      if (item.type === 'structure') {
        const trajectoryElement = item.trajList[0];
        this.player = new NGL.TrajectoryPlayer(trajectoryElement.trajectory, {
          start: this.globalMin,
          end: this.globalMax,
          step: 1,
          timeout: PLAYER_TIMEOUT,
          interpolateType: 'spline',
          interpolateStep: 1,
          mode: 'loop',
          direction: 'forward'
        });
      }
    });
  }

  private storeSubscription() {
    this.subs.sink = this.displayAll$.subscribe(isAll => {
      if (!isAll) {
        return;
      }
      if (!this.dynophoreShapes) {
        this.dynophoreShapes = this.parserService.dynophoreDrawing(this.dynophore);
      }
      if (isAll == 'show') {
        this.toggleSelected('show');
      } else if (isAll == 'hide') {
        this.toggleSelected('hide');
      }
    });
    this.subs.sink = this.isDisplaySelected$.subscribe(isSelected => {
      this.isSelected = isSelected;
      if (this.isSelected && this.range.length > 0) {
        this.toggleSelected();
      }
    });
    this.subs.sink = this.isRange$.subscribe(range => {
      if (range) {
        this.range = range;
      }
      if (this.isSelected && this.range.length > 0) {
        this.toggleSelected();
      }
    });
    this.subs.sink = this.globalMax$.subscribe(globalMax => {
      this.globalMax = globalMax;
    });
    this.subs.sink = this.globalMin$.subscribe(globalMin => {
      this.globalMin = globalMin;
    });
    this.subs.sink = this.playStatus$.subscribe(playStatus => {
      this.playStatus = playStatus;
      if (this.player) {
        this.togglePlayer(playStatus);
      }
    });
    this.subs.sink = this.currentFrame$.subscribe(currentFrame => {
      this.currentFrame = currentFrame;
    });
    this.subs.sink = this.hidePast$.subscribe(state => {
      this.isPrevHidden = state;
    });
    this.subs.sink = this.playRange$.subscribe(state => {
      this.playRange = state && state.length > 0 ? state : [this.globalMin, this.globalMax];
      if (this.player) {
        this.togglePlayer('stop');
        this.store.dispatch(PlayerActions.setPlay({ playStatus: 'stop' }));
      }
    });
  }

  private frameChangedListener(frame: any) {
    if (frame < 0) {
      return;
    }
    this.playDynophore(frame);
    this.store.dispatch(PlayerActions.setCurrentFrame({currentFrame: frame}));
  }

  private stageClicked(clicked: any) {
    if (clicked?.picker?.shape?.name) {
      this.store.dispatch(SelectionActions.setSelected({ selected: this.parserService.getFeatureCloudInfo(clicked?.picker?.shape?.name) }));
    } else {
      this.store.dispatch(SelectionActions.removeSelected());
    }
  }

  private clearStage(isCustom?: boolean) {
    if (isCustom) {
      this.parserService.clearFeatureClouds();
      this.stageInstance.removeAllComponents();
    }
  }
}
