import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DynophoresViewerComponent } from '@dynophores-viewer/dynophores-viewer/dynophores-viewer.component';
import { Routes, RouterModule } from '@angular/router';

export const viewerRoutes: Routes = [
  {
      path: '',
      component: DynophoresViewerComponent
  }
]

@NgModule({
  declarations: [
    DynophoresViewerComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(viewerRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class DynophoresViewerModule { }

