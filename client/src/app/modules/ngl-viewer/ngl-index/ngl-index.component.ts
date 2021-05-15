import { Component, OnInit } from '@angular/core';
import { FilesService } from '@/app/services/files.service';

import { NGL } from '@/app/ngl.const';
import { switchMap } from 'rxjs/operators';
import { SubSink } from 'subsink';
import { ParserService } from '../../_dynophores-viewer/services/dynophore.parser.service';

@Component({
  selector: 'dyno-ngl-index',
  templateUrl: './ngl-index.component.html',
  styleUrls: ['./ngl-index.component.scss']
})
export class NglIndexComponent implements OnInit {
  private stageInstance: any;
  private subs = new SubSink();
  private structureComponent: any;

  constructor(
    private _filesService: FilesService,
    private _parserService: ParserService
  ) { }

  ngOnInit(): void {
    this.stageInstance = new NGL.Stage('viewport');
    this.initPdbDcd();
    this.initPml();
  }

  private initPdbDcd() {
    this.subs.sink = this._filesService.uploadPdb(this.stageInstance).pipe(
      switchMap(pdb => {
        console.log('pdb', pdb);
        this.structureComponent =
            this._parserService.structureDrawing(pdb, this.stageInstance);
        this.structureComponent.rebuildRepresentations();
        return this._filesService.uploadDcd();
      })
    ).subscribe((dcd: any) => {
      console.log('dcd', dcd);
      this.structureComponent.addTrajectory(dcd, {
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
    });
  }

  private initPml() {
    this.subs.sink = this._filesService.uploadPml().subscribe((pmlRaw: any) => {
      const pml = this._filesService.parseDynophore(pmlRaw);
      console.log('pml', pml);
    });
  }

}
