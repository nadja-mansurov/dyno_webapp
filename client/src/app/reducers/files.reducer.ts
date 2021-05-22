
import {
  createReducer,
  on,
  State,
  Action
} from '@ngrx/store';
//import {User} from '../model/user.model';
import { FilesActions } from '@/app/actions/action-types';
import { IFileState } from '@/app/reducers/interfaces';



export const initialFilesState: IFileState = {
  pdbFile: undefined,
  pmlFile: undefined,
  dcdFile: undefined,
  custom: false,
  min: 0,
  max: 0
};

const filesReducer = createReducer(

  initialFilesState,

  on(FilesActions.pdbUpload, (state: IFileState, { pdbFile }) => {
    let next = Object.assign({}, state);
    next.pdbFile = pdbFile;
    return next;
  }),

  on(FilesActions.pmlUpload, (state: IFileState, { pmlFile }) => {
    let next = Object.assign({}, state);
    next.pmlFile = pmlFile;
    return next;
  }),

  on(FilesActions.dcdUpload, (state: IFileState, { dcdFile }) => {
    let next = Object.assign({}, state);
    next.dcdFile = dcdFile;
    return next;
  }),

  on(FilesActions.setCustom, (state: IFileState, { custom }) => {
    let next = Object.assign({}, state);
    next.custom = custom;
    return next;
  }),

  on(FilesActions.setMin, (state: IFileState, { min }) => {
    let next = Object.assign({}, state);
    next.min = min;
    return next;
  }),

  on(FilesActions.setMax, (state: IFileState, { max }) => {
    let next = Object.assign({}, state);
    next.max = max;
    return next;
  })
);

export function FilesReducer(state: IFileState | undefined, action: Action) {
  return filesReducer(state, action);
}
