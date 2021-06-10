

import {createAction, props} from '@ngrx/store';

export const setFile = createAction(
  "[File Action] File upload",
  props<{ blob: any, fileType: 'pdb' | 'pml' | 'dcd' }>()
);

export const pdbUpload = createAction(
  "[File Action] Pdb file upload",
  props<{ pdbFile: any }>()
);

export const pmlUpload = createAction(
  "[File Action] Pml file upload",
  props<{ pmlFile: any }>()
);

export const dcdUpload = createAction(
  "[File Action] Dcd file upload",
  props<{ dcdFile: any }>()
);

export const setCustom = createAction(
  "[File Action] Set custom file",
  props<{ custom: boolean }>()
);

export const setMin = createAction(
  "[File Action] Set min",
  props<{ min: number }>()
);

export const setMax = createAction(
  "[File Action] Set max",
  props<{ max: number }>()
);
