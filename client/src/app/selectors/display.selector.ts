import { createSelector, createFeatureSelector } from '@ngrx/store';
import { IDisplayState } from '@/app/reducers/interfaces';

export const selectDisplayState =
    createFeatureSelector<IDisplayState>('display');

export const isDisplayAll = createSelector(
    selectDisplayState,
    (display) => display.all,
);

export const isDisplaySelected = createSelector(
    selectDisplayState,
    (display) => display.selected,
);

export const getRange = createSelector(
    selectDisplayState,
    (display) => display.range,
);
