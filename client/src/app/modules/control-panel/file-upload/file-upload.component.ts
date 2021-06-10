import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { FILE_TYPES } from '@/app/const/fileTypes.const';

@Component({
  selector: 'dyno-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements OnInit {
  @Output() setFile: EventEmitter<any> = new EventEmitter();
  @Input() type: 'pdb' | 'pml' | 'dcd' | null = null;
  public title: string = '';

  public acceptedTypes = '';
  public error = false;

  constructor(
  ) {

  }

  ngOnInit(): void {
    console.log('this.type', this.type);
    if (!this.type) {
      this.error = true;
      return;
    }
    this.error = false;

    if (this.type === FILE_TYPES.pdb) {
      this.acceptedTypes = '.pdb,.PDB';
    }
    if (this.type === FILE_TYPES.pml) {
      this.acceptedTypes = '.pml,.PML';
    }
    if (this.type === FILE_TYPES.dcd) {
      this.acceptedTypes = '.dcd,.DCD';
    }

    this.title = this.type.toUpperCase() + ' file';
  }

  onFileSelected($event: any) {
    this.setFile.emit(URL.createObjectURL($event.target.files[0]));
    //this._uploadFilesService.setFile(fileURL, this.type, $event.target.files[0].name)
  }
}
