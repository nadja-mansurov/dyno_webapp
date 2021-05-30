
import { Injectable } from '@angular/core';
import { XmlParser } from '@angular/compiler';
import { FeatureCloudModel } from '../models/feature-cloud.model';
import { DynophoreModel } from '../models/dynophore.model';
import { DynophoreAtomModel } from '../models/dynophore-atom.model';
import { Vector3 } from 'three';
import { AdditionalPointModel } from '../models/additional-point.model';

import { NGL } from '@/app/ngl.const';
import { Store } from '@ngrx/store';
import { AppState } from '../reducers';
import { FilesActions } from '../actions/action-types';

@Injectable({
  providedIn: 'any'
})
export class ParserService {

  private xmlParser: XmlParser = new XmlParser();

  constructor(
    private store: Store<AppState>
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

    let shapeComp = stageInstance.addComponentFromObject(new NGL.Shape(pdbFile));
    shapeComp.addRepresentation('buffer', { opacity: 0.3 });

    pdbFile.autoView();
    return pdbFile;
  }

  getShowingIndecies(defRange: number[], selectedType: 'hide'|'show'|null, globalMin: number, globalMax: number) {
    let range: number[] = [];
    console.log(defRange, selectedType, globalMin, globalMax);
    if (selectedType === 'show') {
      for (let i = defRange[0]; i <= defRange[1]; i++) {
        range.push(i);
      }
    } else if (selectedType === 'hide') {
      for (let i = globalMin; i < defRange[0]; i++) {
        range.push(i);
      }
      for (let i = defRange[1]; i <= globalMax; i++) {
        range.push(i);
      }
    }

    return range;
  }

  dynophoreDrawing(dynophore: any, atomsCoordsList?: DynophoreAtomModel[]) {
    let shapes: any = {};
    let min = 1000000; // magic number
    let max = 0;
    dynophore.featureClouds.map((featureCloud: any) => {
      let shape = new NGL.Shape(featureCloud.featureId);

      featureCloud.additionalPoints.map((item: AdditionalPointModel) => {
        if (item.frameIndex > max) {
          max = item.frameIndex;
        }
        if (item.frameIndex < min) {
          min = item.frameIndex;
        }
        item.setVisibility();
        if (!item.hidden) {
          shape.addSphere(item.position, featureCloud.featureColor, item.radius, `${featureCloud.name} frame index is ${item.frameIndex}`);
        }
      });

      shapes[featureCloud.featureId] = shape;
    });

    this.store.dispatch(FilesActions.setMin( { min: min }));
    this.store.dispatch(FilesActions.setMax( { max: max }));

    return shapes;
  }

  dynophoreDrawingByVisible(dynophore: any, visibleIndecies: number[], showConnections?: boolean) {
    let shapes: any = {};
    dynophore.featureClouds.map((featureCloud: any) => {
      let shape = new NGL.Shape(featureCloud.featureId);

      featureCloud.additionalPoints.map((item: AdditionalPointModel) => {
        item.setVisibility(visibleIndecies);
        if (!item.hidden) {
          shape.addSphere(item.position, featureCloud.featureColor, item.radius, `${featureCloud.name} frame index is ${item.frameIndex}`);
        }
      });
/*
      if (showConnections) {
        featureCloud.involvedAtomSerials.map((item: number) => {
          console.log('Test', item);
        });
      } */
      shapes[featureCloud.featureId] = shape;
    });

    return shapes;
  }

  additionalPointDrawing() {

  }

};



