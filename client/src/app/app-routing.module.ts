import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from '@views/home/home.component';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('@dynophores-viewer/dynophores-viewer.module')
                          .then(m => m.DynophoresViewerModule),
    //component: HomeComponent
  },
  {
    path: 'ngl',
    loadChildren: () => import('@ngl-viewer/ngl-viewer.module')
                          .then(m => m.NglViewerModule)
  },
  {
    path: 'viewer',
    loadChildren: () => import('@dynophores-viewer/dynophores-viewer.module')
                          .then(m => m.DynophoresViewerModule),
  },
  {
    path: '',
    redirectTo: '',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
