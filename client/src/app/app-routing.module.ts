import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NglComponent } from '@views/ngl/ngl.component';

const routes: Routes = [
  { path: 'ngl', component: NglComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
