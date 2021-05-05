import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'any'
})
export class ControlsService {

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

    setVisibleFrame(val: number[]) {
      this.visibleFrames.next(val);
    }

    getVisibleFrame() {
      return this.visibleFrames;
    }

}
