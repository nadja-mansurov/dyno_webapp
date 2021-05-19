import { createSelector, createFeatureSelector } from '@ngrx/store';
import { IFileState } from '@/app/reducers/interfaces';

export const selectFileState =
    createFeatureSelector<IFileState>("files");

export const isCustom = createSelector(
  selectFileState,
  files => files.custom
);

