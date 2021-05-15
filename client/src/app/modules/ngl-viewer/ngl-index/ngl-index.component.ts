import { Component, OnInit } from '@angular/core';
import { FilesService } from '@/app/services/files.service';

import { NGL } from '@/app/ngl.const';

@Component({
  selector: 'dyno-ngl-index',
  templateUrl: './ngl-index.component.html',
  styleUrls: ['./ngl-index.component.scss']
})
export class NglIndexComponent implements OnInit {
  private stageInstance: any;
  constructor(
    private _filesService: FilesService
  ) { }

  ngOnInit(): void {
    this.stageInstance = new NGL.Stage('viewport');
    this._filesService.initialize(this.stageInstance);
  }

}
