
import {createAction, props} from '@ngrx/store';


export const pdbUpload = createAction(
  "[File Action] Pdb file upload",
  props<{pdbFile: any}>()
);

export const pmlUpload = createAction(
  "[File Action] Pml file upload",
  props<{pmlFile: any}>()
);

export const dcdUpload = createAction(
  "[File Action] Dcd file upload",
  props<{dcdFile: any}>()
);

export const setCustom = createAction(
  "[File Action] Set custom file",
  props<{custom: boolean}>()
);
