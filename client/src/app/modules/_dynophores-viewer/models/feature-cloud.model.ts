import { Vector3, Color } from 'three';
import { AdditionalPointModel, IAdditionalPoint } from './additional-point.model';

export interface IFeatureCloud {
  id: string;
  name: string;
  featureColor: Color;
  featureId: string;
  optional: boolean;
  disabled: boolean;
  weight: number;
  involvedAtomSerials: number[];
  position: Vector3;
  additionalPoints: IAdditionalPoint[];
  minima?: Vector3;
  maxima?: Vector3;
  x: number;
  y: number;
  z: number;
};

export class FeatureCloudModel {
  id: string = '';
  name: string = '';
  featureColor: Color = new Color(0xff0000);
  featureId: string = '';
  optional: boolean = false;
  disabled: boolean = false;
  weight: number = 1.0;
  involvedAtomSerials: Array<number> = [];
  position: Vector3 = new Vector3(0, 0, 0);
  additionalPoints: AdditionalPointModel[] = [];
  minima?: Vector3 = new Vector3(0.0, 0.0, 0.0);
  maxima?: Vector3 = new Vector3(0.0, 0.0, 0.0);
  x: number = 0.0;
  y: number = 0.0;
  z: number = 0.0;

  constructor(data: any) {
    data.attrs.map((item: any) => {
      if (item.name === 'name') this.name = item.value;
      if (item.name === 'id') this.id = item.value;
      if (item.name === 'featureColor') this.featureColor = new Color(`#${item.value}`);
      if (item.name === 'featureId') this.featureId = item.value;
      if (item.name === 'optional') this.optional = item.value;
      if (item.name === 'weight') this.weight = item.value;
      if (item.name === 'involvedAtomSerials')
        this.involvedAtomSerials = item.value.split(',').map((x:string):number => +x);
    })
    data.children.map((item: any) => {
      if (item.name === 'position')
        this.position = this.renderPosition(item.attrs);
      if (item.name === 'additionalPoint') {
        this.additionalPoints.push(new AdditionalPointModel(item.attrs, this.position));
      }
    });
    this.getMinMax();
  }

  renderPosition(pos:any): Vector3 {
    let x, y, z;
    pos.map((item: any) => {
      if (item.name === 'x3') this.x = x = +item.value;
      if (item.name === 'y3') this.y = y = +item.value;
      if (item.name === 'z3') this.z = z = +item.value;
    })
    return new Vector3(x, y, z);
  }

  getMinMax() {
    let localMax = 0;
    let localMin = 100000000;
    this.additionalPoints.map(attrs => {
      const distance = attrs.position.distanceTo(this.position);
      if (distance > localMax) {
        localMax = distance;
        this.maxima = attrs.position;
      }
      if (distance < localMax) {
        localMin = distance;
        this.minima = attrs.position;
      }
    });
  }
}
