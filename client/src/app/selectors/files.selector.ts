import { createSelector, createFeatureSelector } from '@ngrx/store';
import { IFileState } from '@/app/reducers/interfaces';

export const selectAuthState =
    createFeatureSelector<IFileState>("files");

export const isCustom = createSelector(
  selectAuthState,
  files => files.custom
);

