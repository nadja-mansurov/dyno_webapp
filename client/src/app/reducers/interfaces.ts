
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
  frameIndecies: Array<number>,
  id: string|null,
  involvedAtomSerials: Array<number>,
  name: string|null,
  frameIndeciesDict: any
}

export interface ITabState {
  tab: 'ngl'|'chart'
}
