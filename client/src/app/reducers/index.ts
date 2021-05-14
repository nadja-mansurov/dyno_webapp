import {
  ActionReducer,
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
  MetaReducer
} from '@ngrx/store';
import { environment } from '@/environments/environment';

import { FilesReducer } from '@/app/reducers/files.reducer';
import { IFileState, IPlayerState, IDisplayState, ISelectionState } from './interfaces';
import { PlayerReducer } from './player.reducer';
import { DisplayReducer } from './display.reducer';
import { SelectionReducer } from './selection.reducer';

export interface AppState {
  files: IFileState,
  player: IPlayerState,
  display: IDisplayState,
  selection: ISelectionState
}

export const reducers: ActionReducerMap<AppState> = {
    files: FilesReducer,
    player: PlayerReducer,
    display: DisplayReducer,
    selection: SelectionReducer
};

export function logger(reducer:ActionReducer<any>)
    : ActionReducer<any> {
    return (state, action) => {
        console.log("state before: ", state);
        console.log("action", action);
        const after = reducer(state, action);
        console.log("state after: ", after);

        return after;
    }

}


export const metaReducers: MetaReducer<AppState>[] =
    !environment.production ? [logger] : [];
