import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { NglComponent } from '@ngl-viewer/ngl/ngl.component';

export const viewerRoutes: Routes = [
  {
      path: '',
      component: NglComponent
  }
]


@NgModule({
  declarations: [
    NglComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(viewerRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class NglViewerModule { }
