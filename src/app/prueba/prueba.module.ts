import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PruebaRoutingModule } from './prueba-routing.module';
import { PruebaComponent } from './prueba.component';
import { ComponentsModule } from '../components/components.module';
import { DirectivesModule } from '../directives/directives.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../components/material.module';
import { TableVirtualScrollModule } from 'ng-table-virtual-scroll';



@NgModule({
  declarations: [PruebaComponent],
  imports: [
    CommonModule,
    PruebaRoutingModule,

    ComponentsModule,
    MaterialModule,
    DirectivesModule,

    ReactiveFormsModule,
    FormsModule
  ]
})
export class PruebaModule { }
