import { Vector3 } from 'three';

export class AdditionalPointModel {
  position: Vector3 = new Vector3(0, 0, 0);
  weigth: number = 0.0;
  frameIndex: number = 0;
  bufferArray: number[] = [0.0, 0.0, 0.0];
  radius: number = 0.2;
  distance: number = 0.0;
  x: number = 0.0;
  y: number = 0.0;
  z: number = 0.0;
  hidden?: boolean = false;

  constructor(data: any, center: Vector3) {
    let x, y, z;
    data.map((item: any) => {
      if (item.name === 'weight') this.weigth = item.value;
      if (item.name === 'frameIndex') this.frameIndex = +item.value;
      if (item.name === 'x3') {
        this.x = x = item.value;
        this.bufferArray[0] = x;
      }
      if (item.name === 'y3') {
        this.y = y = item.value;
        this.bufferArray[1] = y;
      }
      if (item.name === 'z3') {
        this.z = z = item.value;
        this.bufferArray[2] = z;
      }
    });
    this.position = new Vector3(x, y, z);
    this.distance = center.distanceTo(this.position);
  }

  setVisibility(frames: number[], isVisible?: boolean) {
    if (frames.indexOf(this.frameIndex) > -1) {
      this.hidden = !isVisible;
    } else {
      this.hidden = isVisible;
    }
  }

}