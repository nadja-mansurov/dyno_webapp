import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, combineLatest, of, from } from 'rxjs';
import { NGL } from '@/app/ngl.const';

import { environment } from '@/environments/environment';

@Injectable({
  providedIn: 'any'
})
export class ControlsService {

  private playState = new BehaviorSubject(false);

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

}
