import { Component, OnInit, OnDestroy } from '@angular/core';
import { SubSink } from 'subsink';
import { UploadFilesService } from '@dynophores-viewer/services/file-upload.service';


@Component({
  selector: 'dyno-dynophores-viewer',
  templateUrl: './dynophores-viewer.component.html',
  styleUrls: ['./dynophores-viewer.component.scss'],
  providers: [
    UploadFilesService
  ]
})
export class DynophoresViewerComponent implements OnInit, OnDestroy {

  private subs = new SubSink();

  constructor(
    private fileUpload: UploadFilesService
  ) { }

  ngOnInit(): void {
    this.subs.sink = this.fileUpload.getFiles('dyno_dynophore', 'json').subscribe(item => {
      console.log('GOT JSON FILE', item)
    });
    this.subs.sink = this.fileUpload.getFiles('dyno_dynophore', 'pml').subscribe(item => {
      console.log('GOT PML FILE', item)
    });
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

}
