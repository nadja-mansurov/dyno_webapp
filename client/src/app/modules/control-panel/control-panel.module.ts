import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { ControlPanelIndexComponent } from '@modules/control-panel/control-panel-index/control-panel-index.component';
import { RangeComponent } from '@modules/control-panel/range/range.component';
import { FileUploadComponent } from '@modules/control-panel/file-upload/file-upload.component';



@NgModule({
  declarations: [
    ControlPanelIndexComponent,
    RangeComponent,
    FileUploadComponent
  ],
  imports: [
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule
  ],
  exports: [
    ControlPanelIndexComponent
  ]
})
export class ControlPanelModule { }
