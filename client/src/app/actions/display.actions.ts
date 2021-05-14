
import {createAction, props} from '@ngrx/store';


export const displ = createAction(
    "[1] 1",
    props<{pdbFile: any}>()
);
