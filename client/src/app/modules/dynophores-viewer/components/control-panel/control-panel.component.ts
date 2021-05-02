import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { UploadFilesService } from '@dynophores-viewer/services/files.service';

@Component({
  selector: 'dyno-control-panel',
  templateUrl: './control-panel.component.html',
  styleUrls: ['./control-panel.component.scss']
})
export class ControlPanelComponent implements OnInit {
  @Output() getCloudVisibility: EventEmitter<boolean> = new EventEmitter();

  public allowToDraw = false;

  constructor(
    private _uploadFilesService: UploadFilesService
  ) { }

  ngOnInit(): void {
    this._uploadFilesService.uploaded$.subscribe(state => {
      this.allowToDraw = state;
    });
  }

  setCloudVisibility(val: boolean) {
    this.getCloudVisibility.emit(val);
  }

  draw() {
    this._uploadFilesService.redraw();

  }
}
