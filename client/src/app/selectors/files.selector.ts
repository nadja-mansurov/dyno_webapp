import { createSelector, createFeatureSelector } from '@ngrx/store';
import { IFileState } from '@/app/reducers/interfaces';

export const selectFileState =
    createFeatureSelector<IFileState>("files");

export const isCustom = createSelector(
  selectFileState,
  files => files.custom
);

export const globalMin = createSelector(
  selectFileState,
  files => files.min
);

export const globalMax = createSelector(
  selectFileState,
  files => files.max
);