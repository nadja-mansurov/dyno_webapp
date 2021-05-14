
import {createAction, props} from '@ngrx/store';


export const play = createAction(
    "[1] 1",
    props<{pdbFile: any}>()
);
