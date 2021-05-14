
import {
  createReducer,
  on,
  State,
  Action
} from '@ngrx/store';
//import {User} from '../model/user.model';
import { PlayerActions } from '@/app/actions/action-types';
import { IPlayerState } from '@/app/reducers/interfaces';



export const initialPlayerState: IPlayerState = {
  play: 'stop',
  currentFrame: null,
  hidePast: true,
  range: [0,0]
};

const playerReducer = createReducer(

  initialPlayerState,

);

export function PlayerReducer(state: IPlayerState | undefined, action: Action) {
  return playerReducer(state, action);
}
