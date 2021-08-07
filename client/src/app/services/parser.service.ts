
import { Injectable } from '@angular/core';
import { XmlParser } from '@angular/compiler';
import * as tinycolor from 'tinycolor2';
import { Vector3, Color } from 'three';
import { Store } from '@ngrx/store';
import { NGL } from '@/app/const/ngl.const';

import { FeatureCloudModel } from '@/app/models/feature-cloud.model';
import { DynophoreModel } from '@/app/models/dynophore.model';
import { DynophoreAtomModel } from '@/app/models/dynophore-atom.model';
import { AdditionalPointModel } from '@/app/models/additional-point.model';

import { AppState } from '@/app/reducers';
import { FilesActions } from '@/app/actions/action-types';
import { ISelectionState } from '@/app/reducers/interfaces';

@Injectable({
  providedIn: 'any',
})
export class ParserService {

  private xmlParser: XmlParser = new XmlParser();
  private featureClouds: any = {};

  constructor(
    private store: Store<AppState>,
  ) { }

  public parseDynophore(dynophoreFile: any):any {

    const parsed = this.xmlParser.parse(dynophoreFile, 'dyno_dynophore.pml');
    if (!parsed || parsed.errors.length > 0) return null;
    return new DynophoreModel(parsed.rootNodes[1]);

  };

  getAtomDynophoreInteractions(atoms: number[], structureComponent: any) {

    let i = 1;
    const coords: any = {};
    structureComponent.structure.eachAtom((ap: any) => {

      if (atoms.indexOf(ap.serial) > -1) {

        if (!coords[i]) {

          coords[i] = new DynophoreAtomModel({
            serial: ap.serial,
            element: ap.element,
            atomname: ap.atomname,
            resno: ap.resno,
            resname: ap.resname,
            coords: new Vector3(ap.x, ap.y, ap.z),
          });

        }

      }
      i++;

    });
    return coords;

  }

  structureDrawing(pdbFile: any, stageInstance: any, fileName?: string) {

    pdbFile.addRepresentation('cartoon', {
      colorScheme: 'element',
      crossSize: 0.75 });

    const shapeComp = stageInstance.addComponentFromObject(new NGL.Shape(pdbFile));
    shapeComp.addRepresentation('buffer', { opacity: 0.3 });

    pdbFile.autoView();
    return pdbFile;

  }

  getShowingIndecies(defRange: number[], selectedType: 'hide'|'show'|null, globalMin: number, globalMax: number) {

    const range: number[] = [];
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

  dynophoreDrawing(dynophore: any) {

    const shapes: any = {};
    let min = 1000000; // magic number
    let max = 0;
    dynophore.featureClouds.map((featureCloud: FeatureCloudModel) => {

      const shape = new NGL.Shape(featureCloud.featureId);
      featureCloud.additionalPoints.map((item: AdditionalPointModel) => {

        if (item.frameIndex > max) {

          max = item.frameIndex;

        }
        if (item.frameIndex < min) {

          min = item.frameIndex;

        }
        item.setVisibility();
        if (!item.hidden) {

          shape.addSphere(item.position,
              featureCloud.featureColor,
              item.radius, `${featureCloud.name} frame index is ${item.frameIndex}`);

        }

        this.featureClouds[shape.name] = {
          name: featureCloud.name,
          id: featureCloud.id,
          involvedAtomSerials: featureCloud.involvedAtomSerials,
          frameIndecies: featureCloud.frameIndecies,
          frameIndeciesDict: featureCloud.frameIndeciesDict,
        } as ISelectionState;

      });
      shapes[featureCloud.featureId] = shape;

    });

    this.store.dispatch(FilesActions.setMin( { min: min }));
    this.store.dispatch(FilesActions.setMax( { max: max }));

    return shapes;

  }

  parseAtomCoord(atomData: any) {

    const atomIndicies = atomData.index;
    const atomPositions = atomData.position;

    const res: any = {};
    let i = 0;

    atomIndicies.map((item: any) => {

      res[item] = new Vector3(atomPositions[i], atomPositions[i+1], atomPositions[i+2]);
      i = i + 3;

    });
    return res;

  }

  dynophoreDrawingByVisible(dynophore: any, visibleIndecies: number[], atomsCoordsList?: any) {

    const shapes: any = {};
    dynophore.featureClouds.map((featureCloud: any) => {

      const shape = new NGL.Shape(featureCloud.featureId);
      let position: any = null;

      featureCloud.additionalPoints.map((item: AdditionalPointModel) => {

        item.setVisibility(visibleIndecies);
        if (!item.hidden) {

          const tinyColor = '#' + tinycolor(featureCloud.featureColor.getHexString()).darken(25).toHex();
          const cloudColor = item.opacity && atomsCoordsList ? new Color(tinyColor) : featureCloud.featureColor;

          position = item.position;
          shape.addSphere(item.position,
              cloudColor,
              item.radius, `${featureCloud.name} frame index is ${item.frameIndex}`);

        }

      });

      if (atomsCoordsList && position) {

        featureCloud.involvedAtomSerials.map((item: number) => {

          const atomPosition = atomsCoordsList[item];
          shape.addArrow(position, atomPosition, featureCloud.featureColor, 0.05, `${featureCloud.name}`);

        });

      }
      shapes[featureCloud.featureId] = shape;

    });

    return shapes;

  }

  additionalPointDrawing() {

  }

  getFeatureCloudInfo(name: string) {

    if (!this.featureClouds[name]) return null;
    return this.featureClouds[name];

  }

  clearFeatureClouds() {

    this.featureClouds = {};

  }

};


