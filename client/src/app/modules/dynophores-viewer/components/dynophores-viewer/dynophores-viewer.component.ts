import { Component, OnInit, OnDestroy } from '@angular/core';
import { SubSink } from 'subsink';
import { XmlParser } from '@angular/compiler';
import { combineLatest } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { UploadFilesService } from '@dynophores-viewer/services/file-upload.service';
import { ParserService } from '@dynophores-viewer/services/dynophore.parser.service';

import { NGL } from '@/app/ngl.const';
import { UtilsService } from '@dynophores-viewer/services/utils.service';
import { AdditionalPointModel } from '@dynophores-viewer/models/additional-point.model';

@Component({
  selector: 'dyno-dynophores-viewer',
  templateUrl: './dynophores-viewer.component.html',
  styleUrls: ['./dynophores-viewer.component.scss'],
  providers: [ UploadFilesService, ParserService ]
})
export class DynophoresViewerComponent implements OnInit, OnDestroy {
  private subs = new SubSink();
  private xmlParser: XmlParser = new XmlParser();

  constructor(
    private fileUpload: UploadFilesService,
    private parserService: ParserService,
    private utils: UtilsService
  ) {}

  ngOnInit(): void {
    let stageInstance = new NGL.Stage('viewport');
    //this.testDrawPdb();
    let pdb: any;

    this.subs.sink = combineLatest([
      this.fileUpload.getFiles('dyno_dynophore', 'pml'),
      this.fileUpload.getFiles('dyno_dynophore', 'json'),
      this.fileUpload.getFiles('startframe', 'pdb', stageInstance)
    ]).pipe(
      switchMap(([pmlFile, jsonFile, pdbFile]) => {
        //console.log('jsonFile File', jsonFile);
        pdb = this.drawPdb(pdbFile, stageInstance);
        this.drawCloud(pmlFile, stageInstance);
        return this.fileUpload.getFiles('trajectory', 'dcd')
      })
    )
    .subscribe(dcdFile => {
      pdb.addTrajectory(dcdFile, {
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
      //console.log('PDB File', pdb);

    });
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  private drawCloud(pmlFile: any, stageInstance: any) {
    const dynophore = this.parserService.parseDynophore(pmlFile);

    console.log(dynophore);
    dynophore.featureClouds.map((featureCloud: any) => {
      let shape = new NGL.Shape(featureCloud.featureId);
      //shape.addSphere(featureCloud.position, featureCloud.featureColor, 5*featureCloud.weight, featureCloud.name);

      featureCloud.additionalPoints.map((item: AdditionalPointModel) => {
        shape.addSphere(item.position, featureCloud.featureColor, item.radius, `${featureCloud.name} frame index is ${item.frameIndex}`);
      });

      let shapeComp = stageInstance.addComponentFromObject(shape);
      // TODO: To be dependent on time & frame index

      shapeComp.addRepresentation('buffer', { opacity: 0.7 });
      shapeComp.autoView();
    });
  }

  private drawPdb(pdbFile: any, stageInstance: any) {
    let shape = new NGL.Shape(pdbFile);
    let shapeComp = stageInstance.addComponentFromObject(shape);
    shapeComp.addRepresentation('buffer', { opacity: 0.3 });
    pdbFile.addRepresentation("backbone", {
      lines: true,
      crosses: `lone`,
      colorScheme: "element",
      crossSize: 0.75 })

    pdbFile.autoView()

    return pdbFile;
  }
}
