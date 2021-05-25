import { Component, OnInit, OnDestroy } from '@angular/core';

import { switchMap } from 'rxjs/operators';
import { SubSink } from 'subsink';
import { NGL } from '@/app/ngl.const';
import { ParserService } from '@/app/services/parser.service';
import { FilesService } from '@/app/services/files.service';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { AppState } from '@/app/reducers';
import { isDisplayAll, isDisplaySelected, getRange } from '@/app/selectors/display.selector';
import { globalMax, globalMin } from '@/app/selectors/files.selector';

@Component({
  selector: 'dyno-ngl-index',
  templateUrl: './ngl-index.component.html',
  styleUrls: ['./ngl-index.component.scss']
})
export class NglIndexComponent implements OnInit, OnDestroy {
  private stageInstance: any;
  private subs = new SubSink();
  private structureComponent: any;
  private dynophore: any;
  private dynophorShapes: any;
  private shapeComponents: any = {};

  private range: number[] = [];
  private isSelected: 'show'|'hide'|null = null;
  private globalMax = 0;
  private globalMin = 0;

  private displayAll$: Observable<'show'|'hide'|null>;
  private isDisplaySelected$: Observable<'show'|'hide'|null>;
  private isRange$: Observable<number[]|null>;

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
  }

  ngOnInit(): void {
    this.stageInstance = new NGL.Stage('viewport');
    this.initPdbDcd();
    //this.initPml();

    this.subs.sink = this.displayAll$.subscribe(isAll => {
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
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  private initPdbDcd() {
    this.subs.sink = this.filesService.uploadPdb(this.stageInstance).pipe(
      switchMap(pdb => {
        console.log('pdb', pdb);
        this.structureComponent =
            this.parserService.structureDrawing(pdb, this.stageInstance);

        this.structureComponent.autoView();
        return this.filesService.uploadDcd();
      }),
      switchMap((dcdFile: any) => {
        this.structureComponent.addTrajectory(dcdFile, {
          initialFrame: 100,
          defaultTimeout: 100,
          defaultStep: undefined,
          defaultInterpolateType: 'spline',
          defaultDirection: 'forward',
          centerPbc: false,
          removePbc: false,
          superpose: true,
          sele: 'backbone and not hydrogen'
        })
        console.log('this.structureComponent', this.structureComponent);
        return this.filesService.uploadPml()
      })
    ).subscribe((pmlRaw: any) => {
      this.dynophore = this.parserService.parseDynophore(pmlRaw);
      this.drawCloud();
      console.log('this.dynophore', this.dynophore);
    });
  }

  private drawCloud() {
    this.dynophorShapes = this.parserService.dynophoreDrawing(this.dynophore, []);

    this.showDynophore();
  }

  private showDynophore() {
    const len = Object.keys(this.dynophorShapes).length;
    Object.keys(this.dynophorShapes).map((shapeId, i) => {
      this.shapeComponents[shapeId] = this.stageInstance.addComponentFromObject(this.dynophorShapes[shapeId]);
      this.shapeComponents[shapeId].addRepresentation('buffer', { opacity: 0.9 });
      if (len == i+1) {
        this.shapeComponents[shapeId].autoView();
      }
    });
  }

  private removeDynophore() {
    this.dynophorShapes = this.parserService.dynophoreDrawing(this.dynophore, []);
    Object.keys(this.dynophorShapes).map(shapeId => {
      this.stageInstance.removeComponent(this.shapeComponents[shapeId]);
    });
  }

  private toggleSelected() {
    this.removeDynophore();
    const range = this.parserService.getShowingIndecies(this.range, this.isSelected, this.globalMin, this.globalMax);
    this.dynophorShapes = this.parserService.dynophoreDrawingByVisible(this.dynophore, range);
    this.showDynophore();
  }

}
