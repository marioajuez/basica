import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ComponentsModule } from './components/components.module';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DirectivesModule } from './directives/directives.module';
import { AuthService } from './auth/auth.service';
import { AuthGuard } from './auth/auth.guard';
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,

    ComponentsModule,
    DirectivesModule,

    ReactiveFormsModule,
    FormsModule
  ],
  // providers: [AuthService, AuthGuard],
  providers: [],

  bootstrap: [AppComponent]
})
export class AppModule { }
