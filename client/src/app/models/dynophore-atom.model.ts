import { Vector3, Color } from 'three';

class DynophoreData {
  dynophoreId: string;
  featureCloudId: string;
  featureCloudName: string;
  id: string;
  color: Color;
  position: Vector3;


  constructor(data: any) {
    this.dynophoreId = data.dynophoreId;
    this.featureCloudId = data.featureCloudId;
    this.featureCloudName = data.featureCloudName;
    this.id = data.id;
    this.color = data.color;
    this.position = data.position;
  }
}

class Atom {
  atomname: string = '';
  coords: Vector3 = new Vector3(0.0, 0.0, 0.0);
  element: string = '';
  resname: string = '';
  resno: number = 0;
  serial: number = 0;

  constructor(data: any) {
    this.atomname = data.atomname;
    this.coords = data.coords;
    this.element = data.element;
    this.resname = data.resname;
    this.resno = data.resno;
    this.serial = data.serial;
  }
}

export class DynophoreAtomModel {
  dynophore: DynophoreData;
  atom: Atom;
  label?: string = '';
  color?: Color;
  position1?: Vector3;
  position2?: Vector3;


  constructor(data: any){
    this.atom = new Atom(data);
    this.dynophore = new DynophoreData(data);
  }

  addDynophore(data: any) {
    this.dynophore = new DynophoreData(data);
  }

  setConnection() {
    const ap = this.atom;
    const dn = this.dynophore;
    this.label = `${dn.featureCloudName} --> [${ap.resname}]${ap.resno}:${ap.element}.${ap.atomname}`;
    this.color = dn.color;
    this.position1 = dn.position;
    this.position2 = ap.coords;

  }

}
