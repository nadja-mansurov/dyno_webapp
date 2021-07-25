
import { createAction, props } from '@ngrx/store';
import { ISelectionState } from '@/app/reducers/interfaces';


export const setSelected = createAction(
    '[Selection Action] Set Selected',
    props<{ selected: ISelectionState }>(),
);

export const removeSelected = createAction(
    '[Selection Action] Remove Selected',
);
