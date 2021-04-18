import { FeatureCloudModel } from './feature-cloud.model';

export class DynophoreModel {
  id: string = '';
  name: string = '';
  pharmacophoreType: string = '';
  featureClouds: FeatureCloudModel[] = [];

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
  }
}
