
import {createAction, props} from '@ngrx/store';


export const setAll = createAction(
    "[Display Actions] Set all",
    props<{all: 'show'|'hide'|null}>()
);

export const setSelected = createAction(
  "[Display Actions] Set selected",
  props<{selected: 'show'|'hide'|null}>()
);


export const setRange = createAction(
  "[Display Actions] Set range",
  props<{range: number[] }>()
);

export const setRangeSelected = createAction(
  "[Display Actions] Set range",
  props<{range: number[], selected: 'show'|'hide'|null}>()
);
