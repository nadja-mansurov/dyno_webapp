import { Component, OnInit, OnDestroy, Input, OnChanges, SimpleChanges } from '@angular/core';
import { SubSink } from 'subsink';
import { switchMap, takeUntil } from 'rxjs/operators';

import { NGL } from '@/app/ngl.const';
import { UploadFilesService } from '@dynophores-viewer/services/files.service';
import { ParserService } from '@dynophores-viewer/services/dynophore.parser.service';
import { ControlsService } from '../../services/controls.service';
import { Observable, from, EMPTY, of, interval } from 'rxjs';

const PLAYER_TIMEOUT = 500;

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
  private player: any = null;
  private atomsCoordsList: any = {}; // coordinates of structure atoms (pdb), involved with dynophore (pml) interactions
  private stageInstance: any;
  private dynopherShapes: any = null;
  private shapeComponents: any = {};

  private frame: any = 0;

  constructor(
    private _uploadFilesService: UploadFilesService,
    private parserService: ParserService,
    private _controlsService: ControlsService
  ) {}

  ngOnInit(): void {
    this.stageInstance = new NGL.Stage('viewport');

    this.subs.sink = this._controlsService.getPlay().pipe(
      switchMap((val: boolean) => {
        if (!this.player) return EMPTY;
        if (val) {
          this.player.setParameters({
            start: this.frame
          });
          this.player.play();
          return interval(PLAYER_TIMEOUT/10); // check the frame number every PLAYER_TIMEOUT tume
        } else {
          this.frame = this.player.traj.currentFrame+1;
          this.player.stop();
          if (this.frame !== this.player.traj.currentFrame) {
            console.log('this.frame', this.frame);
            this._controlsService.setVisibleFrame([this.frame+1]);
            this.atomsCoordsList =
              this.parserService.getAtomDynophoreInteractions(this.dynophore.allInvolvedAtoms, this.structureComponent);

            this.redrawCloud();
          }
          return EMPTY;
        }
      })
    ).subscribe(frame => {
      //console.log('this.player.traj.currentFrame', this.player.traj.currentFrame);
      if (this.frame !== this.player.traj.currentFrame) {
        console.log('this.frame', this.frame);
        this.frame = this.player.traj.currentFrame;
        this._controlsService.setVisibleFrame([this.frame]);
        this.atomsCoordsList =
          this.parserService.getAtomDynophoreInteractions(this.dynophore.allInvolvedAtoms, this.structureComponent);

        this.redrawCloud();
      }
    });

    this.subs.sink = this._uploadFilesService.redraw$.subscribe(redraw => {
      if (redraw) {
        this.atomsCoordsList = {};
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

        this.structureComponent.rebuildRepresentations();
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
      this.setTrajectoryPlayer();
    })
  }

  private setTrajectoryPlayer() {
    this.stageInstance.eachComponent((item: any) => {
      if (item.type === 'structure') {
        const trajectoryElement = item.trajList[0];
        this.player = new NGL.TrajectoryPlayer(trajectoryElement.trajectory, {step: 1, timeout: PLAYER_TIMEOUT});
        //player.play();
      }
    });
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

  private redrawCloud() {
    this.removeDynophore();
    this.dynopherShapes = this.parserService.dynophoreDrawingByVisible(this.dynophore, [this.frame+1], this.atomsCoordsList);
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
    this.dynopherShapes = this.parserService.dynophoreDrawing(this.dynophore, [], this.atomsCoordsList);
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
