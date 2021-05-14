import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'any'
})
export class ControlsService {

  private isAllVisible = new BehaviorSubject(false);
  private playingInterval = new BehaviorSubject<number[]|null>(null);
  private playState = new BehaviorSubject(false);
  private visibleFrames: BehaviorSubject<number[]> = new BehaviorSubject<number[]>([]);

  constructor(
    private http: HttpClient
    ) {
    }

    setPlay(val: boolean) {
      this.playState.next(val);
    }

    getPlay() {
      return this.playState;
    }

    setAllVisible(val: boolean) {
      if (val !== this.isAllVisible.value) {
        this.isAllVisible.next(val);
      }
    }

    getAllVisible() {
      return this.isAllVisible;
    }

    setVisibleFrame(val: number[]) {
      this.visibleFrames.next(val);
    }

    getVisibleFrame() {
      return this.visibleFrames;
    }

    setPlayingInterval(interval: number[]|null) {
      this.playingInterval.next(interval);
    }

    getPlayingInterval() {
      return this.playingInterval;
    }

}
