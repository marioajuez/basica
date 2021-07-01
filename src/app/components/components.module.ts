import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './material.module';
import { PaginatorComponent } from './paginator/paginator.component';




@NgModule({
  declarations: [
    PaginatorComponent
  ],
  imports: [
    CommonModule,
    MaterialModule
  ],
  exports:[
    PaginatorComponent
  ]
})
export class ComponentsModule { }
