import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlPanelIndexComponent } from './control-panel-index/control-panel-index.component';
import { RangeComponent } from './range/range.component';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';



@NgModule({
  declarations: [
    ControlPanelIndexComponent,
    RangeComponent,
    FileUploadComponent
  ],
  imports: [
    HttpClientModule,
    ReactiveFormsModule,
    CommonModule
  ],
  exports: [
    ControlPanelIndexComponent
  ]
})
export class ControlPanelModule { }
