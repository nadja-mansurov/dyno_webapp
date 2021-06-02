import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';

import { switchMap } from 'rxjs/operators';
import { SubSink } from 'subsink';
import { NGL } from '@/app/ngl.const';
import { ParserService } from '@/app/services/parser.service';
import { FilesService } from '@/app/services/files.service';
import { Observable, interval } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { AppState } from '@/app/reducers';
import { isDisplayAll, isDisplaySelected, getRange } from '@/app/selectors/display.selector';
import { globalMax, globalMin } from '@/app/selectors/files.selector';
import { playSelector, currentFrameSelector } from '@/app/selectors/play.selector';
import { PlayerActions, DisplayActions } from '@/app/actions/action-types';
import { DynophoreAtomModel } from '@/app/models/dynophore-atom.model';


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
  private dynophore: any;
  private dynophoreShapes: any;
  private shapeComponents: any = {};
  private player: any;
  private currentFrame: number|null = null;

  private range: number[] = [];
  private isSelected: 'show'|'hide'|null = null;
  private globalMax = 0;
  private globalMin = 0;
  private playStatus: 'play'|'pause'|'stop' = 'stop';
  private interval: any;

  private displayAll$: Observable<'show'|'hide'|null>;
  private isDisplaySelected$: Observable<'show'|'hide'|null>;
  private isRange$: Observable<number[]|null>;
  private playStatus$: Observable<'play'|'pause'|'stop'>;
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
    this.currentFrame$ = this.store.pipe(select(currentFrameSelector))
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  ngAfterViewInit() {
    this.stageInstance = new NGL.Stage('viewport');
    this.initPdbDcd();
    this.storeSubscription();
  }

  public clickOnView($event: any) {
    console.log('clickOnView', $event);
    /*if (this.player && this.playStatus === 'play') {
      this.store.dispatch(PlayerActions.setPlay({ playStatus: 'pause' }));
    }*/
  }

  private initPdbDcd() {
    this.subs.sink = this.filesService.uploadPdb(this.stageInstance).pipe(
      switchMap(pdb => {
        console.log('pdb', pdb);
        this.structureComponent =
            this.parserService.structureDrawing(pdb, this.stageInstance);

        //this.structureComponent.autoView();
        return this.filesService.uploadDcd();
      }),
      switchMap((dcdFile: any) => {
        console.log('dcdFile', dcdFile);
        this.structureComponent.addTrajectory(dcdFile, {
          deltaTime: PLAYER_TIMEOUT,
          timeOffset: 0,
          removePeriodicity: false,
          centerPbc: false,
          remo: false,
          superpose: false
        })
        console.log('this.structureComponent', this.structureComponent);
        this.playerInit();
        return this.filesService.uploadPml()
      })
    ).subscribe((pmlRaw: any) => {
      this.dynophore = this.parserService.parseDynophore(pmlRaw);
      this.atomsCoordsList =
        this.parserService.getAtomDynophoreInteractions(this.dynophore.allInvolvedAtoms, this.structureComponent);
      this.drawCloud();
      this.structureComponent.autoView();
    });
  }

  private drawCloud() {
    this.dynophoreShapes = this.parserService.dynophoreDrawing(this.dynophore);
    this.showDynophore();
  }

  private showDynophore() {
    const len = Object.keys(this.dynophoreShapes).length;
    Object.keys(this.dynophoreShapes).map((shapeId, i) => {
      this.shapeComponents[shapeId] = this.stageInstance.addComponentFromObject(this.dynophoreShapes[shapeId]);
      this.shapeComponents[shapeId].addRepresentation('buffer', { opacity: 0.9 });
      if (len == i+1) {
        this.shapeComponents[shapeId].autoView();
      }
    });
  }

  private removeDynophore() {
    Object.keys(this.dynophoreShapes).map(shapeId => {
      this.stageInstance.removeComponent(this.shapeComponents[shapeId]);
    });
  }

  private toggleSelected() {
    this.removeDynophore();
    const range = this.parserService.getShowingIndecies(this.range, this.isSelected, this.globalMin, this.globalMax);
    this.dynophoreShapes = this.parserService.dynophoreDrawingByVisible(this.dynophore, range);
    this.showDynophore();
  }

  private playDynophore(currentFrame: number) {
    if (!currentFrame) return;
    this.removeDynophore();
    const range = [currentFrame, currentFrame + 1];
    this.dynophoreShapes = this.parserService.dynophoreDrawingByVisible(this.dynophore, range, this.atomsCoordsList);

    Object.keys(this.dynophoreShapes).map((shapeId, i) => {
      this.shapeComponents[shapeId] = this.stageInstance.addComponentFromObject(this.dynophoreShapes[shapeId]);
      this.shapeComponents[shapeId].addRepresentation('buffer', { opacity: 0.9 });
    });
  }

  private togglePlayer(playStatus: 'play'|'pause'|'stop') {
    if (playStatus === 'play') {
      this.player.play();
      let curFrame = this.player.traj.currentFrame;
      this.interval = interval(PLAYER_TIMEOUT/10).subscribe(() => {
        if (this.player.traj.currentFrame !== curFrame) {
          this.playDynophore(this.player.traj.currentFrame);
          this.store.dispatch(PlayerActions.setCurrentFrame({currentFrame: this.player.traj.currentFrame}));
          curFrame = this.player.traj.currentFrame;
        }
      });
    } else if (playStatus === 'pause') {
      this.player.pause();
      if (this.interval)  {
        this.interval.unsubscribe();
      }
    } else if (playStatus === 'stop') {
      this.player.stop();
      if (this.interval)  {
        //this.store.dispatch(DisplayActions.setAll({all: 'show'}));
        this.interval.unsubscribe();
      }
    }

  }

  private playerInit() {
    this.stageInstance.eachComponent((item: any) => {
      if (item.type === 'structure') {
        const trajectoryElement = item.trajList[0];
        this.player = new NGL.TrajectoryPlayer(trajectoryElement.trajectory, {
          start: 0,
          end: 100,
          step: 1,
          timeout: PLAYER_TIMEOUT,
          interpolateType: 'spline',
          interpolateStep: 1,
          mode: 'loop',
          direction: 'forward'
        });
        //player.play();
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
        this.showDynophore();
      } else if (isAll == 'hide') {
        this.removeDynophore();
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
  }
}
