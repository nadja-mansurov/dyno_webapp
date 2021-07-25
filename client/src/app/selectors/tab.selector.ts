import { createSelector, createFeatureSelector } from '@ngrx/store';
import { ITabState } from '@/app/reducers/interfaces';

export const selectTabState =
    createFeatureSelector<ITabState>('tab');

export const tabSelected = createSelector(
    selectTabState,
    (tab) => tab.tab,
);
