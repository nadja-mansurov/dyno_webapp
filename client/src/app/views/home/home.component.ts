import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { AppState } from '@/app/reducers';
import { SubSink } from 'subsink';

import { tabSelected } from '@/app/selectors/tab.selector';
import { TabActions } from '@/app/actions/action-types';


const BUTTON_TYPE = {
  'ngl': {
    'type': 'ngl',
    'button': 'Frames diagram',
  },
  'chart': {
    'type': 'chart',
    'button': 'Ngl viewer',
  },
};


@Component({
  selector: 'dyno-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {

  public buttonHeader = 'Frames diagram';
  public pageType: 'ngl'|'chart' = 'ngl';

  private subs = new SubSink();
  private tabSelected$: Observable<'ngl'|'chart'>;

  constructor(
    private store: Store<AppState>,
  ) {

    this.tabSelected$ = of(this.pageType);
    this.tabSelected$ = this.store.pipe(select(tabSelected));

  }

  ngOnInit(): void {

    this.subs.sink = this.tabSelected$.subscribe((tab) => {

      if (tab === 'ngl') {

        this.toggle('ngl');

      } else {

        this.toggle('chart');

      }

    });

  }

  public toggleView() {

    if (this.pageType === 'ngl') {

      this.toggle('chart', true);

    } else {

      this.toggle('ngl', true);

    }

  }

  private toggle(pageType: 'ngl'|'chart', fromView?: boolean) {

    this.buttonHeader = BUTTON_TYPE[pageType].button;
    this.pageType = <'ngl'|'chart'>BUTTON_TYPE[pageType].type;
    if (fromView) {

      this.store.dispatch(TabActions.setTab({ tab: pageType }));

    }

  }

}
