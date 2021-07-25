import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NglIndexComponent } from '@modules/ngl-viewer/ngl-index/ngl-index.component';
import { SelectedInfoComponent } from '@modules/ngl-viewer/selected-info/selected-info.component';


@NgModule({
  declarations: [
    NglIndexComponent,
    SelectedInfoComponent,
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    NglIndexComponent,
  ],
})
export class NglViewerModule { }
