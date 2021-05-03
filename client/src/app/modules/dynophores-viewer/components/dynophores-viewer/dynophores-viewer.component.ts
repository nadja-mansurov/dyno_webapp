import { Component, OnInit, OnDestroy, Input, OnChanges, SimpleChanges } from '@angular/core';
import { SubSink } from 'subsink';
import { switchMap } from 'rxjs/operators';

import { NGL } from '@/app/ngl.const';
import { UploadFilesService } from '@dynophores-viewer/services/files.service';
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
        this.clearStage();
        setTimeout(() => {
          this.redraw();
        }, 1000);
      }
    });

    this.getData();

  }

  private getData() {
    this.subs.sink = this._uploadFilesService.filesStructure(this.stageInstance).pipe(
      switchMap((pdbFile: any) => {
        this.structureComponent =
            this.parserService.structureDrawing(pdbFile, this.stageInstance);

        return this._uploadFilesService.filesTrajectory();
      }),
      switchMap((dcdFile: any) => {
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
        });
        this.structureComponent.rebuildTrajectories();
        return this._uploadFilesService.filesDynophore();
      })
    ).subscribe((pmlFile:any) => {
      this.dynophore = this.parserService.parseDynophore(pmlFile);
      this.atomsCoordsList =
          this.parserService.getAtomDynophoreInteractions(this.dynophore.allInvolvedAtoms, this.structureComponent);

      this.drawCloud();

    })
  }

  private redraw() {
    this.getData();
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

  private clearStage() {
    this.stageInstance.eachComponent((item: any) => {
      if (item.type !== 'structure') {
        this.stageInstance.removeComponent(item);
      }
    });
  }

  private drawCloud() {
    this.dynopherShapes = this.parserService.dynophoreDrawing(this.dynophore, this.hiddenFrames || [], this.atomsCoordsList);

    this.showDynophore();
  }

  private toggleFrames(indecies: Array<number>) {
    if (this.stageInstance) {
      this.removeDynophore();
      this.dynopherShapes = this.parserService.dynophoreDrawing(this.dynophore, indecies, this.atomsCoordsList);
      this.showDynophore();
    }
  }

  private toggleVisibility(value: boolean) {
    if (value) {
      this.dynopherShapes = this.parserService.dynophoreDrawing(this.dynophore, [], this.atomsCoordsList);
      this.showDynophore();
    } else {
      this.removeDynophore();
    }
  }

  private removeDynophore() {
    Object.keys(this.dynopherShapes).map(shapeId => {
      this.stageInstance.removeComponent(this.shapeComponents[shapeId]);
    });
  }

  private showDynophore() {
    Object.keys(this.dynopherShapes).map(shapeId => {
      this.shapeComponents[shapeId] = this.stageInstance.addComponentFromObject(this.dynopherShapes[shapeId]);
      this.shapeComponents[shapeId].addRepresentation('buffer', { opacity: 0.9 });
    });
  }

  private removeByShapeId(shapeId: string) {
    this.stageInstance.removeComponent(this.shapeComponents[shapeId]);
  }

}
