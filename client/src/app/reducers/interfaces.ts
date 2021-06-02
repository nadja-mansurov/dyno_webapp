import { FeatureCloudModel } from '@models/feature-cloud.model';


export interface IFileState {
  pdbFile: any,
  pmlFile: any,
  dcdFile: any,
  custom: boolean,
  min: number,
  max: number
}

export interface IPlayerState {
  play: 'play'|'pause'|'stop',
  currentFrame: number|null,
  hidePast: boolean,
  range: Array<number>
}

export interface IDisplayState {
  all: 'show'|'hide'|null,
  selected: 'show'|'hide'|null,
  range: Array<number>
}

export interface ISelectionState {
  feature: FeatureCloudModel|null
}
