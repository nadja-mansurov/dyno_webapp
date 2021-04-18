import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { DynophoresViewerComponent } from '@dynophores-viewer/dynophores-viewer/dynophores-viewer.component';


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
    HttpClientModule,
    RouterModule.forChild(viewerRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class DynophoresViewerModule { }

