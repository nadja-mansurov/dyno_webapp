import { createSelector, createFeatureSelector } from '@ngrx/store';
import { IFileState } from '@/app/reducers/interfaces';

export const selectFileState =
    createFeatureSelector<IFileState>("files");

export const isCustom = createSelector(
  selectFileState,
  files => files.custom
);

export const getPdbFile = createSelector(
  selectFileState,
  files => files.pdbFile
);

export const getPmlFile = createSelector(
  selectFileState,
  files => files.pmlFile
);

export const getDcdFile = createSelector(
  selectFileState,
  files => files.dcdFile
);

export const globalMin = createSelector(
  selectFileState,
  files => files.min
);

export const globalMax = createSelector(
  selectFileState,
  files => files.max
);

export const isReadyToDraw = createSelector(
  selectFileState,
  files => {
    if (files.custom && files.pdbFile && files.pmlFile && files.dcdFile) return true;
    return false;
  }
);
