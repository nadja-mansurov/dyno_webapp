import { createSelector, createFeatureSelector } from '@ngrx/store';
import { ISelectionState } from '@/app/reducers/interfaces';

export const selectSelectorState =
    createFeatureSelector<ISelectionState>('selection');

export const selectionSelector = createSelector(
    selectSelectorState,
    (selection) => selection,
);
