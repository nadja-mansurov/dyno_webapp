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
  elementName?: string|null;
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
  frameIndecies: number[] = [];
  elementName?: string|null;
  frameIndeciesDict?: any;
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
        const point = new AdditionalPointModel(item.attrs, this.position);
        this.additionalPoints.push(point);
        if (this.frameIndecies.indexOf(point.frameIndex) < 0) {
          this.frameIndecies.push(point.frameIndex);
          this.frameIndeciesDict = true;
        }
      }
    });
    this.frameIndecies.sort((n1,n2) => n1 - n2);
  }

  set nglName(name: string|null) {
    this.elementName = name;
  }

  get nglName(): string|null {
    if (!this.elementName){
      return null;
    }
    return this.elementName;
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

}
