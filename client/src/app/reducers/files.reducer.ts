
import {
  createReducer,
  on,
  Action,
} from '@ngrx/store';
// import {User} from '../model/user.model';
import { FilesActions } from '@/app/actions/action-types';
import { IFileState } from '@/app/reducers/interfaces';

import { FILE_TYPES } from '@/app/const/fileTypes.const';


export const initialFilesState: IFileState = {
  pdbFile: undefined,
  pmlFile: undefined,
  dcdFile: undefined,
  custom: false,
  min: 0,
  max: 0,
};

const filesReducer = createReducer(

    initialFilesState,

    on(FilesActions.setFile, (state: IFileState, { blob, fileType }) => {

      const next = Object.assign({}, state);
      if (fileType === FILE_TYPES.pdb ) next.pdbFile = blob;
      if (fileType === FILE_TYPES.pml ) next.pmlFile = blob;
      if (fileType === FILE_TYPES.dcd ) next.dcdFile = blob;
      return next;

    }),

    on(FilesActions.removeFiles, (state: IFileState) => {

      const next = Object.assign({}, state);
      next.pdbFile = undefined;
      next.pmlFile = undefined;
      next.dcdFile = undefined;
      return next;

    }),

    on(FilesActions.pdbUpload, (state: IFileState, { pdbFile }) => {

      const next = Object.assign({}, state);
      next.pdbFile = pdbFile;
      return next;

    }),

    on(FilesActions.pmlUpload, (state: IFileState, { pmlFile }) => {

      const next = Object.assign({}, state);
      next.pmlFile = pmlFile;
      return next;

    }),

    on(FilesActions.dcdUpload, (state: IFileState, { dcdFile }) => {

      const next = Object.assign({}, state);
      next.dcdFile = dcdFile;
      return next;

    }),

    on(FilesActions.setCustom, (state: IFileState, { custom }) => {

      const next = Object.assign({}, state);
      next.custom = custom;
      return next;

    }),

    on(FilesActions.setMin, (state: IFileState, { min }) => {

      const next = Object.assign({}, state);
      next.min = min;
      return next;

    }),

    on(FilesActions.setMax, (state: IFileState, { max }) => {

      const next = Object.assign({}, state);
      next.max = max;
      return next;

    }),
);

export function FilesReducer(state: IFileState | undefined, action: Action) {

  return filesReducer(state, action);

}
