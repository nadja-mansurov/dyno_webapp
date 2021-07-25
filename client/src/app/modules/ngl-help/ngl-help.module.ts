import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HelpIndexComponent } from '@ngl-help/help-index/help-index.component';


@NgModule({
  declarations: [
    HelpIndexComponent,
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    HelpIndexComponent,
  ],
})
export class NglHelpModule { }
