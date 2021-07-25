

import { createAction, props } from '@ngrx/store';

export const setTab = createAction(
    '[Tab Action] Tab set',
    props<{ tab: 'ngl' | 'chart' }>(),
);
