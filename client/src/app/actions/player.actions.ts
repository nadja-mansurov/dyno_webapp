
import { createAction, props } from '@ngrx/store';


export const setPlay = createAction(
    '[Player Action] Set play status',
    props<{playStatus: 'stop'|'pause'|'play'}>(),
);

export const setCurrentFrame = createAction(
    '[Player Action] Set current frame',
    props<{currentFrame: number}>(),
);

export const setHidePast = createAction(
    '[Player Action] Set hide past',
    props<{hidePast: boolean}>(),
);

export const setRange = createAction(
    '[Player Action] Set range',
    props<{range: number[]}>(),
);
