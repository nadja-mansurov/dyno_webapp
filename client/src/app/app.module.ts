import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '@/environments/environment';

import { AppRoutingModule } from '@/app/app-routing.module';
import { AppComponent } from '@/app/app.component';
import { NglViewerModule } from '@ngl-viewer/ngl-viewer.module';
import { ControlPanelModule } from '@control-panel/control-panel.module';
import { HomeComponent } from '@/app/views/home/home.component';

import { metaReducers, reducers } from '@/app/reducers';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent
  ],
  imports: [
    StoreModule,
    StoreDevtoolsModule,
    BrowserModule,
    AppRoutingModule,
    NglViewerModule,
    ControlPanelModule,
    StoreModule.forRoot(reducers, {
      metaReducers,
      runtimeChecks : {
          strictStateImmutability: true,
          strictActionImmutability: true,
          strictActionSerializability: true,
          strictStateSerializability:true
      }
  }),
  StoreDevtoolsModule.instrument({maxAge: 25, logOnly: environment.production}),

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
