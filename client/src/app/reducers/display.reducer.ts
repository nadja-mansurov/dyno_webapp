
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
  all: null,
  selected: null,
  range: [0,0]
};

const displayReducer = createReducer(
  initialDisplayState,
  on(DisplayActions.setAll, (state: IDisplayState, { all }) => {
    let next = Object.assign({}, state);
    next.selected = null;
    next.all = all;
    return next;
  }),
  on(DisplayActions.setSelected, (state: IDisplayState, { selected }) => {
    let next = Object.assign({}, state);
    next.all = null;
    next.selected = selected;
    return next;
  }),
  on(DisplayActions.setRange, (state: IDisplayState, { range }) => {
    let next = Object.assign({}, state);
    next.range = range;
    return next;
  }),
  on(DisplayActions.setRangeSelected, (state: IDisplayState, { range, selected }) => {
    let next = Object.assign({}, state);
    next.all = null;
    next.range = range;
    next.selected = selected;
    return next;
  }),
);

export function DisplayReducer(state: IDisplayState | undefined, action: Action) {
  return displayReducer(state, action);
}
