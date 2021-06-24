import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { switchMap } from 'rxjs/operators';
import { Observable, interval, combineLatest, pipe } from 'rxjs';
import { SubSink } from 'subsink';

import { AppState } from '@/app/reducers';
import { globalMax, globalMin } from '@/app/selectors/files.selector';
import { selectionSelector } from '@/app/selectors/selection.selector';
import { ISelectionState } from '@/app/reducers/interfaces';

@Component({
  selector: 'dyno-selected-info',
  templateUrl: './selected-info.component.html',
  styleUrls: ['./selected-info.component.scss']
})
export class SelectedInfoComponent implements OnInit, OnDestroy {

  public selected: ISelectionState|null = null;
  public globalFrames: Array<number> = [];

  private subs = new SubSink();
  private selected$: Observable<ISelectionState>;

  private globalMax$: Observable<number>;
  private globalMin$: Observable<number>;

  constructor(
    private store: Store<AppState>
    ) {
      this.selected$ = this.store.pipe(select(selectionSelector));

      this.globalMax$ = this.store.pipe(select(globalMax));
      this.globalMin$ = this.store.pipe(select(globalMin));
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  ngOnInit(): void {
    this.subs.sink = this.selected$.subscribe((selected:ISelectionState) => {
      this.selected = selected;
    });

    this.subs.sink = combineLatest([
      this.globalMax$,
      this.globalMin$
    ]).pipe(
      switchMap((res: any) => {
        this.globalFrames = [];
        for (let i = res[1]; i <= res[0]; i++) {
          this.globalFrames.push(i);
        }
        return this.selected$;
      })
    ).subscribe((selected:ISelectionState) => {
      //console.log(this.globalFrames);
      this.selected = selected;
    });
  }


}
