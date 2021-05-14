
import {createAction, props} from '@ngrx/store';


export const pdbUpload = createAction(
    "[Pdb File] File uploaded",
    props<{pdbFile: any}>()
);
