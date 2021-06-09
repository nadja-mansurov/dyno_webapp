import { createSelector, createFeatureSelector } from '@ngrx/store';
import { IPlayerState } from '@/app/reducers/interfaces';

export const selectPlayerState =
    createFeatureSelector<IPlayerState>("player");

export const currentFrameSelector = createSelector(
  selectPlayerState,
  player => player.currentFrame
);

export const hidePastSelector = createSelector(
  selectPlayerState,
  player => player.hidePast
);

export const playSelector = createSelector(
  selectPlayerState,
  player => player.play
);

export const rangeSelector = createSelector(
  selectPlayerState,
  player => player.range
);
