
import {
  createReducer,
  on,
  State,
  Action
} from '@ngrx/store';
//import {User} from '../model/user.model';
import { DisplayActions } from '@/app/actions/action-types';
import { IDisplayState } from '@/app/reducers/interfaces';



export const initialDisplayState: IDisplayState = {
  all: 'show',
  selected: null,
  range: [0,0]
};

const displayReducer = createReducer(

  initialDisplayState,

);

export function DisplayReducer(state: IDisplayState | undefined, action: Action) {
  return displayReducer(state, action);
}
