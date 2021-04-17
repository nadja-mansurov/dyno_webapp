import { SuperfeatureModel } from '@dynophores-viewer/models/superfeature.model';

export class DynophoreModel {
  id: string = '';
  ligand_name: string = '';
  ligand_smiles: string = '';
  superfeatures: SuperfeatureModel[] = [];
}
