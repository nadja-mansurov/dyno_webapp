import { Component, OnInit, OnDestroy, Input, OnChanges, SimpleChanges } from '@angular/core';
import { SubSink } from 'subsink';
import { XmlParser } from '@angular/compiler';
import { combineLatest } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { NGL } from '@/app/ngl.const';
import { UploadFilesService } from '@dynophores-viewer/services/file-upload.service';
import { ParserService } from '@dynophores-viewer/services/dynophore.parser.service';

@Component({
  selector: 'dyno-dynophores-viewer',
  templateUrl: './dynophores-viewer.component.html',
  styleUrls: ['./dynophores-viewer.component.scss']
})
export class DynophoresViewerComponent implements OnInit, OnDestroy, OnChanges {
  @Input() hiddenFrames: Array<number> = [];
  @Input() cloudsVisibility: boolean = true;

  private subs = new SubSink();
  private structureComponent: any;
  private dynophore: any = {};
  private atomsCoordsList: any = {}; // coordinates of structure atoms (pdb), involved with dynophore (pml) interactions
  private stageInstance: any;
  private dynopherShapes: any = null;
  private shapeComponents: any = {};

  constructor(
    private _uploadFilesService: UploadFilesService,
    private parserService: ParserService
  ) {}

  ngOnInit(): void {
    this.stageInstance = new NGL.Stage('viewport');

    this.subs.sink = this._uploadFilesService.redraw$.subscribe(redraw => {
      if (redraw) {
        this.stageInstance.removeAllComponents();
        setTimeout(() => {
          this.redraw();
        }, 100);
      }
    });

    this.subs.sink = this._uploadFilesService.files(this.stageInstance).pipe(
      switchMap(([pmlFile, pdbFile]) => {

        this.dynophore = this.parserService.parseDynophore(pmlFile);
        this.structureComponent =
            this.parserService.structureDrawing(pdbFile, this.stageInstance);
        this.atomsCoordsList =
            this.parserService.getAtomDynophoreInteractions(this.dynophore.allInvolvedAtoms, this.structureComponent);

        this.drawCloud();

        return this._uploadFilesService.filesTrajectory();
      })
    )
    .subscribe(dcdFile => {
      this.structureComponent.addTrajectory(dcdFile, {
        initialFrame: 100,
        defaultTimeout: 100,
        defaultStep: undefined,
        defaultInterpolateType: "spline",
        defaultDirection: "forward",
        centerPbc: false,
        removePbc: false,
        superpose: true,
        sele: "backbone and not hydrogen"
      })

    });

  }

  redraw() {
    this.subs.sink = this._uploadFilesService.files(this.stageInstance, true).pipe(
      switchMap(([pmlFile, pdbFile]) => {
        this.dynophore = this.parserService.parseDynophore(pmlFile);
        this.structureComponent =
            this.parserService.structureDrawing(pdbFile, this.stageInstance);
        this.atomsCoordsList =
            this.parserService.getAtomDynophoreInteractions(this.dynophore.allInvolvedAtoms, this.structureComponent);

        this.drawCloud();

        return this._uploadFilesService.filesTrajectory(true);
      })
    )
    .subscribe(dcdFile => {
      this.structureComponent.addTrajectory(dcdFile, {
        initialFrame: 100,
        defaultTimeout: 100,
        defaultStep: undefined,
        defaultInterpolateType: "spline",
        defaultDirection: "forward",
        centerPbc: false,
        removePbc: false,
        superpose: true,
        sele: "backbone and not hydrogen"
      })

    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.hiddenFrames) {
      if (!changes.hiddenFrames.firstChange && changes.hiddenFrames.previousValue !== changes.hiddenFrames.currentValue) {
        this.toggleFrames(<Array<number>>changes.hiddenFrames.currentValue);
      }
    }
    if (changes.cloudsVisibility) {
      if (!changes.cloudsVisibility.firstChange && changes.cloudsVisibility.previousValue !== changes.cloudsVisibility.currentValue) {
        this.toggleVisibility(changes.cloudsVisibility.currentValue);
      }
    }
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  private drawCloud() {
    this.dynopherShapes = this.parserService.dynophoreDrawing(this.dynophore, this.hiddenFrames || [], this.atomsCoordsList);

    this.show();

    Object.keys(this.dynopherShapes).map(shapeId => {
      this.shapeComponents[shapeId].autoView();
    });
  }

  private toggleFrames(indecies: Array<number>) {
    if (this.stageInstance) {
      this.remove();
      this.dynopherShapes = this.parserService.dynophoreDrawing(this.dynophore, indecies, this.atomsCoordsList);
      this.show();
    }
  }

  private toggleVisibility(value: boolean) {
    if (value) {
      this.dynopherShapes = this.parserService.dynophoreDrawing(this.dynophore, [], this.atomsCoordsList);
      this.show();
    } else {
      this.remove();
    }
  }

  private remove() {
    Object.keys(this.dynopherShapes).map(shapeId => {
      this.stageInstance.removeComponent(this.shapeComponents[shapeId]);
    });
  }

  private show() {
    Object.keys(this.dynopherShapes).map(shapeId => {
      this.shapeComponents[shapeId] = this.stageInstance.addComponentFromObject(this.dynopherShapes[shapeId]);
      this.shapeComponents[shapeId].addRepresentation('buffer', { opacity: 0.9 });
    });
  }

  private removeByShapeId(shapeId: string) {
    this.stageInstance.removeComponent(this.shapeComponents[shapeId]);
  }

}
