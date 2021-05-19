import { Component, OnInit } from '@angular/core';
import { FilesService } from '@/app/services/files.service';
import { Store, select } from '@ngrx/store';
import { AppState } from '@/app/reducers';
import { DisplayActions } from '@/app/actions/action-types';
import { Observable } from 'rxjs';
import { isDisplayAll } from '@/app/selectors/display.selector';

@Component({
  selector: 'dyno-control-panel-index',
  templateUrl: './control-panel-index.component.html',
  styleUrls: ['./control-panel-index.component.scss']
})
export class ControlPanelIndexComponent implements OnInit {
  public allowToDraw: boolean = false;
  public isPlay: boolean = false;

  public uploadCustom: boolean = false;
  public playSelected: boolean = false;


  public displayAll$: Observable<'show'|'hide'|null>;

  constructor(
    private store: Store<AppState>,
    private _filesService: FilesService
  ) {
    this.displayAll$ = this.store.pipe(select(isDisplayAll));
  }

  ngOnInit(): void {

  }

  public setCloudVisibility(visibility: 'hide'|'show') {
    this.store.dispatch(DisplayActions.setAll({ all: visibility }));
  }

  public draw() {

  }

  public play(isPlay: boolean) {

  }

  public setFilesOption() {
    this.uploadCustom = !this.uploadCustom;
    this._filesService.setCustom(this.uploadCustom);
  }
}
