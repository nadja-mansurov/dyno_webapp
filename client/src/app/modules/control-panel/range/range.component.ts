import { Component, OnInit, Output, EventEmitter, Input, OnChanges, OnDestroy } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { AppState } from '@/app/reducers';
import { SubSink } from 'subsink';
import { globalMin, globalMax } from '@/app/selectors/files.selector';

interface IRange {
  from: number;
  to: number
}

@Component({
  selector: 'dyno-range',
  templateUrl: './range.component.html',
  styleUrls: ['./range.component.scss']
})
export class RangeComponent implements OnInit, OnDestroy {
  @Output() range: EventEmitter<IRange> = new EventEmitter();
  public from: number|null = null;
  public to: number|null = null;
  public componentMin: number = 0;
  public componentMax: number = 10000;

  public fromControl = new FormControl(this.from,
      [ Validators.min(this.componentMin), Validators.max(this.componentMax)] );
  public toControl = new FormControl(this.to,
      [ Validators.min(this.componentMin), Validators.max(this.componentMax)] );


  private min$: Observable<number>;
  private max$: Observable<number>;

  private subs = new SubSink();

  constructor(
    private store: Store<AppState>,
  ) {

    this.min$ = this.store.pipe(select(globalMin));
    this.max$ = this.store.pipe(select(globalMax));
  }

  ngOnInit(): void {
    this.subs.sink = this.min$.subscribe(min => {
      this.componentMin = min;
      if (!this.from) {
        this.from = this.componentMin;
        this.fromControl.setValue(this.from);
      }
    });
    this.subs.sink = this.max$.subscribe(max => {
      this.componentMax = max;
      if (!this.to) {
        this.to = this.componentMax;
        this.toControl.setValue(this.to);
      }
    });

    this.subs.sink = this.fromControl.valueChanges.subscribe(from => {
      this.setFrom(from);
    })
    this.subs.sink = this.toControl.valueChanges.subscribe(to => {
      this.setTo(to);
    })
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  public setFrom(from: any) {
    if (!this.fromControl.errors) {
      this.from = from;
      this.emitRange();
    } else {
      this.emitRange(true);
    }
  }

  public setTo(to: any) {
    if (!this.toControl.errors) {
      this.to = to;
      this.emitRange();
    } else {
      this.emitRange(true);
    }
  }

  private emitRange(isError?: boolean) {
    if (!this.fromControl.errors && !this.toControl.errors) {
      const range: IRange = {
        from: this.from ? this.from : 0,
        to: this.to ? this.to : 0
      }
      this.range.emit(range);
    }
    if (isError) {
      this.range.emit();
    }

  }
}
