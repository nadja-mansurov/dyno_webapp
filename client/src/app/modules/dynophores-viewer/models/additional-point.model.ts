import { Vector3 } from 'three';

export class AdditionalPointModel {
  position: Vector3 = new Vector3(0, 0, 0);
  weigth: number = 0.0;
  frameIndex: number = 0;
  x: number = 0.0;
  y: number = 0.0;
  z: number = 0.0;

  constructor(data: any) {
    let x, y, z;
    data.map((item: any) => {
      if (item.name === 'weight') this.weigth = item.value;
      if (item.name === 'frameIndex') this.frameIndex = item.value;
      if (item.name === 'x3') this.x = x = item.value;
      if (item.name === 'y3') this.y = y = item.value;
      if (item.name === 'z3') this.z = z = item.value;
    });
    this.position = new Vector3(x, y, z);
  }

}
