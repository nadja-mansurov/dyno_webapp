
import {createAction, props} from '@ngrx/store';


export const setAll = createAction(
    "[Display Actions] Set all",
    props<{all: 'show'|'hide'|null}>()
);
