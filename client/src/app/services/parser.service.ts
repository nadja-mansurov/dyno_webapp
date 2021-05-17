
import { Injectable } from '@angular/core';
import { XmlParser } from '@angular/compiler';
import { FeatureCloudModel } from '../models/feature-cloud.model';
import { DynophoreModel } from '../models/dynophore.model';
import { DynophoreAtomModel } from '../models/dynophore-atom.model';
import { Vector3 } from 'three';
import { AdditionalPointModel } from '../models/additional-point.model';

import { NGL } from '@/app/ngl.const';

@Injectable({
  providedIn: 'any'
})
export class ParserService {

  private xmlParser: XmlParser = new XmlParser();

  constructor(
  ) { }

  public parseDynophore(dynophoreFile: any):any {
    const parsed = this.xmlParser.parse(dynophoreFile, 'dyno_dynophore.pml');
    if (!parsed || parsed.errors.length > 0) return null;
    return new DynophoreModel(parsed.rootNodes[1]);
  };

  getAtomDynophoreInteractions(atoms: number[], structureComponent: any) {
    let i = 1;
    let coords: any = {};
    structureComponent.structure.eachAtom((ap: any) => {
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

  structureDrawing(pdbFile: any, stageInstance: any, fileName?: string) {
    pdbFile.addRepresentation("backbone", {
      colorScheme: "element",
      crossSize: 0.75 })

    let shapeComp = stageInstance.addComponentFromObject(new NGL.Shape(pdbFile),
      {
        backgroundColor: "white",
      });
    shapeComp.addRepresentation('buffer', { opacity: 0.3 });

    pdbFile.autoView();
    return pdbFile;
  }

  dynophoreDrawing(dynophore: any, hiddenIndecies: number[], atomsCoordsList?: DynophoreAtomModel[]) {
    let shapes: any = {};
    dynophore.featureClouds.map((featureCloud: any) => {
      let shape = new NGL.Shape(featureCloud.featureId);

      featureCloud.additionalPoints.map((item: AdditionalPointModel) => {
        item.setVisibility(hiddenIndecies);
        if (!item.hidden) {
          shape.addSphere(item.position, featureCloud.featureColor, item.radius, `${featureCloud.name} frame index is ${item.frameIndex}`);
        }
      });

      /*
      featureCloud.involvedAtomSerials.map((item: number) => {
        const atom = atomsCoordsList[item];
        atom.addDynophore({
          dynophoreId: dynophore.id,
          featureCloudName: featureCloud.name,
          featureCloudId: featureCloud.featureId,
          id: featureCloud.id,
          color: featureCloud.featureColor,
          position: featureCloud.position
        });
        atom.setConnection();
        shape.addArrow(atom.position1, atom.position2, atom.color, 0.05, `${atom.label}`);
      });*/

      shapes[featureCloud.featureId] = shape;
    });

    return shapes;
  }

  dynophoreDrawingByVisible(dynophore: any, visibleIndecies: number[], atomsCoordsList: DynophoreAtomModel[]) {
    let shapes: any = {};
    dynophore.featureClouds.map((featureCloud: any) => {
      let shape = new NGL.Shape(featureCloud.featureId);
      let visiblePosition:any = null;
      let visibleIndex:any = null;

      featureCloud.additionalPoints.map((item: AdditionalPointModel) => {
        item.setVisibility(visibleIndecies, true);
        if (!item.hidden) {
          visiblePosition = item.position;
          visibleIndex = item.frameIndex;
          shape.addSphere(item.position, featureCloud.featureColor, item.radius, `${featureCloud.name} frame index is ${item.frameIndex}`);
        }
      });

      featureCloud.involvedAtomSerials.map((item: number) => {
        const atom = atomsCoordsList[item];
        if (!visibleIndex) return;
        atom.addDynophore({
          dynophoreId: dynophore.id,
          featureCloudName: featureCloud.name,
          featureCloudId: featureCloud.featureId,
          id: featureCloud.id,
          color: featureCloud.featureColor,
          position: featureCloud.position
        });
        atom.setConnection();
        shape.addArrow(visiblePosition || atom.position1, atom.position2, atom.color, 0.05, `${atom.label} frameIndex ${visibleIndex}`);
      });

      shapes[featureCloud.featureId] = shape;


    });

    return shapes;
  }

  additionalPointDrawing() {

  }

};



