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
import { Vector3 } from 'three';
import { DynophoreAtomModel } from '../../models/dynophore-atom.model';

@Component({
  selector: 'dyno-dynophores-viewer',
  templateUrl: './dynophores-viewer.component.html',
  styleUrls: ['./dynophores-viewer.component.scss'],
  providers: [ UploadFilesService, ParserService ]
})
export class DynophoresViewerComponent implements OnInit, OnDestroy {
  private subs = new SubSink();
  private xmlParser: XmlParser = new XmlParser();
  private structureComponent: any;
  private dynophore: any = {};
  private atomsCoordsList: any = {}; // coordinates of structure atoms (pdb), involved with dynophore (pml) interactions

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
    this.dynophore = this.parserService.parseDynophore(pmlFile);

    this.atomsCoordsList = this.getAtoms(this.dynophore.allInvolvedAtoms);
    console.log('dynophore', this.dynophore);
    console.log('this.structure', this.structureComponent);
    console.log('this.atomsCoordsList', this.atomsCoordsList);

    this.dynophore.featureClouds.map((featureCloud: any) => {
      let shape = new NGL.Shape(featureCloud.featureId);

      //shape.addSphere(featureCloud.position, featureCloud.featureColor, 5*featureCloud.weight, featureCloud.name);

      featureCloud.additionalPoints.map((item: AdditionalPointModel) => {
        shape.addSphere(item.position, featureCloud.featureColor, item.radius, `${featureCloud.name} frame index is ${item.frameIndex}`);
      });

      featureCloud.involvedAtomSerials.map((item: number) => {
        const atom = this.atomsCoordsList[item];
        atom.addDynophore({
          dynophoreId: this.dynophore.id,
          featureCloudName: featureCloud.name,
          featureCloudId: featureCloud.featureId,
          id: featureCloud.id,
          color: featureCloud.featureColor,
          position: featureCloud.position
        });
        atom.setConnection();
        shape.addArrow(atom.position1, atom.position2, atom.color, 0.05, `${atom.label}`);
      });

      let shapeComp = stageInstance.addComponentFromObject(shape);
      // TODO: To be dependent on time & frame index

      shapeComp.addRepresentation('buffer', { opacity: 0.9 });
      shapeComp.autoView();
    });
  }

  private drawPdb(pdbFile: any, stageInstance: any) {
    let shape = new NGL.Shape(pdbFile);
    let shapeComp = stageInstance.addComponentFromObject(shape);
    shapeComp.addRepresentation('buffer', { opacity: 0.3 });
    pdbFile.addRepresentation("backbone", {
      colorScheme: "element",
      crossSize: 0.75 })
    pdbFile.autoView()
    this.structureComponent = pdbFile;

    return pdbFile;
  }

  private getAtoms(atoms: number[]) {
    let i = 1;
    let coords: any = {};
    this.structureComponent.structure.eachAtom((ap: any) => {
      if (atoms.indexOf(ap.serial) > -1) {
        if (!coords[i]) coords[i] = new DynophoreAtomModel({
          serial: ap.serial,
          element: ap.element,
          atomname: ap.atomname,
          resno: ap.resno,
          resname: ap.resname,
          coords: new Vector3(ap.x, ap.y, ap.z)
        });
      }
      i++;
    });
    return coords;
  }
}
