
import {
  createReducer,
  on,
  Action,
} from '@ngrx/store';
// import {User} from '../model/user.model';
import { PlayerActions } from '@/app/actions/action-types';
import { IPlayerState } from '@/app/reducers/interfaces';


export const initialPlayerState: IPlayerState = {
  play: 'stop',
  currentFrame: null,
  hidePast: false,
  range: [0, 0],
};

const playerReducer = createReducer(

    initialPlayerState,
    on(PlayerActions.setPlay, (state: IPlayerState, { playStatus }) => {

      const next = Object.assign({}, state);
      next.play = playStatus;
      return next;

    }),
    on(PlayerActions.setCurrentFrame, (state: IPlayerState, { currentFrame }) => {

      const next = Object.assign({}, state);
      next.currentFrame = currentFrame;
      return next;

    }),
    on(PlayerActions.setHidePast, (state: IPlayerState, { hidePast }) => {

      const next = Object.assign({}, state);
      next.hidePast = hidePast;
      return next;

    }),
    on(PlayerActions.setRange, (state: IPlayerState, { range }) => {

      const next = Object.assign({}, state);
      next.range = range;
      return next;

    }),
);

export function PlayerReducer(state: IPlayerState | undefined, action: Action) {

  return playerReducer(state, action);

}
