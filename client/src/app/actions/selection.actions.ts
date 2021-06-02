
import {createAction, props} from '@ngrx/store';


export const selection = createAction(
    "[1] 1",
    props<{pdbFile: any}>()
);
