import { FeatureCloudModel, IFeatureCloud } from './feature-cloud.model';

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
  allInvolvedAtoms: number[] = [];

  constructor(data: any) {
    /** set common file data */
    data.attrs.map( (item: any) => {
      if (item.name === 'name')
        this.name = item.value;
      if (item.name === 'pharmacophoreType')
        this.pharmacophoreType = item.value;
      if (item.name === 'id')
        this.id = item.value;
    });

    data.children.map( (item: any) => {
      this.featureClouds.push(new FeatureCloudModel(item));
    });

    this.featureClouds.map(cloud => {
      // TODO: optimize
      cloud.involvedAtomSerials.map(serial => {
        if (this.allInvolvedAtoms.indexOf(serial) < 0) this.allInvolvedAtoms.push(serial);
      });
    });

  }
}
