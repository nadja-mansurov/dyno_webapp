import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'dyno-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements OnInit {
  @Input() type: string = '';
  @Input() title: string = '';

  public acceptedTypes = '';

  constructor() //private _uploadFilesService: UploadFilesService
  {}

  ngOnInit(): void {
    if (this.type === 'pdb') {
      this.acceptedTypes = '.pdb,.PDB';
    }
    if (this.type === 'pml') {
      this.acceptedTypes = '.pml,.PML';
    }
    if (this.type === 'dcd') {
      this.acceptedTypes = '.dcd,.DCD';
    }
  }

  onFileSelected($event: any) {
    const fileURL = URL.createObjectURL($event.target.files[0]);
    //this._uploadFilesService.setFile(fileURL, this.type, $event.target.files[0].name)
  }
}
