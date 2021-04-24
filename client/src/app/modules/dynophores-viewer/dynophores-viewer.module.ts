import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { DynophoresViewerComponent } from '@dynophores-viewer/components/dynophores-viewer/dynophores-viewer.component';
import { ControlPanelComponent } from '@dynophores-viewer/components/control-panel/control-panel.component';
import { TimelineComponent } from '@dynophores-viewer/components/timeline/timeline.component';
import { DynophoresMainComponent } from '@dynophores-viewer/components/dynophores-main/dynophores-main.component';


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
    DynophoresMainComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule.forChild(viewerRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class DynophoresViewerModule { }

