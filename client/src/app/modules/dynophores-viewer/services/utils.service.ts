import { Injectable } from '@angular/core';
import { Vector3 } from 'three';
import { NGL } from '@/app/ngl.const';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() { }

  public getPosition(pdbFile: any): Float32Array {
    const atomStore = pdbFile.object.atomStore;
    console.log('atomStore', atomStore);
    let positions: Float32Array  = new Float32Array(atomStore.length);
    for (let i = 0; i < atomStore.length; i++) {
      positions[i] = atomStore.x[i];
    }
    return positions;
  }

  public getColor(pdbFile: any): Float32Array {
    const atomStore = pdbFile.object.atomStore;
    let color = new Float32Array(atomStore.length);
    for (let i = 0; i < atomStore.length; i++) {
      color[i] = 0.8;
    }
    return color;
  }

  public getAtomTypeIds(pdbFile: any) {
    let ids: any = {};
    const atomStore = pdbFile.object.atomStore;
    for (let i = 0; i < atomStore.length; i++) {
      let item = atomStore.atomTypeId[i];
      if (!ids[item]) {
        ids[item] = {
          id: item,
          positions: [atomStore.x[i]],
          color: [Math.random()]
        };
      } else {
        ids[item].positions.push(atomStore.x[i]);
        ids[item].color.push(ids[item].color[ids[item].color.length - 1]);
      }
    }
    return ids;
  }

  public getPointBuffer(atomObj: any) {
    const pos = Float32Array.from(atomObj.positions);
    const col = Float32Array.from(atomObj.colors);
    return new NGL.PointBuffer({
      position: pos,
      color: col
    },
    {
      sizeAttenuation: true,
      pointSize: 2,
      opacity: 0.1,
      useTexture: true,
      alphaTest: 0.0,
      edgeBleach: 0.7,
      forceTransparent: true,
      sortParticles: true
    });
  }
}
