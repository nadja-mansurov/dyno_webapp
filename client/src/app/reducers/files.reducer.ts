
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
  })

);

export function FilesReducer(state: IFileState | undefined, action: Action) {
  return filesReducer(state, action);
}
