import { EnvpartenersModel } from '@dynophores-viewer/models/envpartners.model';


export class SuperfeatureModel {
  feature_type: string = '';
  id: string = '';
  atom_numbers: number[] = [];
  envpartners: EnvpartenersModel[] = [];
  occurrences: number[] = [];
};
