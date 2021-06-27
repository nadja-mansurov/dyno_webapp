
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
  id: null,
  name: null,
  frameIndecies: [],
  involvedAtomSerials: [],
  frameIndeciesDict: null
};

const selectionReducer = createReducer(

  initialSelectionState,

  on(SelectionActions.setSelected, (state: ISelectionState, { selected }) => {
    let next = Object.assign({}, state);
    next.id = selected.id;
    next.name = selected.name;
    next.frameIndecies = selected.frameIndecies;
    next.frameIndeciesDict = selected.frameIndeciesDict;
    next.involvedAtomSerials = selected.involvedAtomSerials;
    return next;
  }),

  on(SelectionActions.removeSelected, (state: ISelectionState ) => {
    let next = Object.assign({}, state);
    next.id = null;
    next.name = null;
    next.frameIndecies = [];
    next.frameIndeciesDict = null;
    next.involvedAtomSerials = [];
    return next;
  }),
);

export function SelectionReducer(state: ISelectionState | undefined, action: Action) {
  return selectionReducer(state, action);
}
