import { Component, OnInit, OnDestroy } from '@angular/core';

import { switchMap } from 'rxjs/operators';
import { SubSink } from 'subsink';
import { NGL } from '@/app/ngl.const';
import { ParserService } from '@/app/services/parser.service';
import { FilesService } from '@/app/services/files.service';

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
  private dynopherShapes: any;
  private shapeComponents: any = {};

  constructor(
    private _filesService: FilesService,
    private _parserService: ParserService
  ) { }

  ngOnInit(): void {
    this.stageInstance = new NGL.Stage('viewport');
    this.initPdbDcd();
    this.initPml();
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  private initPdbDcd() {
    this.subs.sink = this._filesService.uploadPdb(this.stageInstance).pipe(
      switchMap(pdb => {
        console.log('pdb', pdb);
        this.structureComponent =
            this._parserService.structureDrawing(pdb, this.stageInstance);

        this.structureComponent.autoView();
        return this._filesService.uploadDcd();
      })
    ).subscribe((dcdFile: any) => {
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
    });
  }

  private initPml() {
    this.subs.sink = this._filesService.uploadPml().subscribe((pmlRaw: any) => {
      this.dynophore = this._parserService.parseDynophore(pmlRaw);
      this.drawCloud();
      console.log('this.dynophore', this.dynophore);
    });
  }

  private drawCloud() {
    this.dynopherShapes = this._parserService.dynophoreDrawing(this.dynophore, []);

    this.showDynophore();
  }

  private showDynophore() {
    Object.keys(this.dynopherShapes).map(shapeId => {
      this.shapeComponents[shapeId] = this.stageInstance.addComponentFromObject(this.dynopherShapes[shapeId]);
      this.shapeComponents[shapeId].addRepresentation('buffer', { opacity: 0.9 });
    });
  }
}
