import { createSelector, createFeatureSelector } from '@ngrx/store';
import { IDisplayState } from '@/app/reducers/interfaces';

export const selectDisplayState =
    createFeatureSelector<IDisplayState>("display");

export const isDisplayAll = createSelector(
  selectDisplayState,
  files => files.all
);

