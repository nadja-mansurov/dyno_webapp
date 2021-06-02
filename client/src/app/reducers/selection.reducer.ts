
import {
  createReducer,
  on,
  State,
  Action
} from '@ngrx/store';
//import {User} from '../model/user.model';
import { SelectionActions } from '@/app/actions/action-types';
import { ISelectionState } from '@/app/reducers/interfaces';



export const initialSelectionState: ISelectionState = {
  feature: null
};

const selectionReducer = createReducer(

  initialSelectionState,

);

export function SelectionReducer(state: ISelectionState | undefined, action: Action) {
  return selectionReducer(state, action);
}
