import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from '@/app/app-routing.module';
import { AppComponent } from '@/app/app.component';
import { NglViewerModule } from '@ngl-viewer/ngl-viewer.module';
import { ControlPanelModule } from '@control-panel/control-panel.module';
import { HomeComponent } from '@/app/views/home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NglViewerModule,
    ControlPanelModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
