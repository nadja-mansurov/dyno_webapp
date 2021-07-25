import { FeatureCloudModel, IFeatureCloud } from './feature-cloud.model';
import { Vector3 } from 'three';

export interface IDynophore {
  id: string;
  name: string;
  pharmacophoreType: string;
  featureClouds: IFeatureCloud[];
  allInvolvedAtoms: number[];
}

export class DynophoreModel {

  id: string = '';
  name: string = '';
  pharmacophoreType: string = '';
  featureClouds: FeatureCloudModel[] = [];
  allInvolvedAtoms: Array<number> = [];
  center: Vector3 = new Vector3(0, 0, 0);

  constructor(data: any) {

    /** set common file data */
    data.attrs.map( (item: any) => {

      if (item.name === 'name') {

        this.name = item.value;

      }
      if (item.name === 'pharmacophoreType') {

        this.pharmacophoreType = item.value;

      }
      if (item.name === 'id') {

        this.id = item.value;

      }

    });

    data.children.map( (item: any) => {

      this.featureClouds.push(new FeatureCloudModel(item));

    });

    this.featureClouds.map((cloud) => {

      // TODO: optimize
      cloud.involvedAtomSerials.map((serial) => {

        if (this.allInvolvedAtoms.indexOf(serial) < 0) this.allInvolvedAtoms.push(serial);

      });

      this.center = new Vector3(cloud.x, cloud.y, cloud.z);

    });

  }

}
