import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';


import { DynophoresViewerComponent } from '@dynophores-viewer/components/dynophores-viewer/dynophores-viewer.component';
import { ControlPanelComponent } from '@dynophores-viewer/components/control-panel/control-panel.component';
import { TimelineComponent } from '@dynophores-viewer/components/timeline/timeline.component';
import { DynophoresMainComponent } from '@dynophores-viewer/components/dynophores-main/dynophores-main.component';
import { FileUploadComponent } from '@dynophores-viewer/components/file-upload/file-upload.component';


export const viewerRoutes: Routes = [
  {
      path: '',
      component: DynophoresMainComponent
  }
]

@NgModule({
  declarations: [
    DynophoresViewerComponent,
    ControlPanelComponent,
    TimelineComponent,
    DynophoresMainComponent,
    FileUploadComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule.forChild(viewerRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class DynophoresViewerModule { }

