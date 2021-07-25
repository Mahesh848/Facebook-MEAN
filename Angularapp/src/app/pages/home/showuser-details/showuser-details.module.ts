import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShowuserDetailsRoutingModule } from './showuser-details-routing.module';
import { ShowuserDetailsComponent } from './showuser-details.component';

@NgModule({
  imports: [
    CommonModule,
    ShowuserDetailsRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [ShowuserDetailsComponent]
})
export class ShowuserDetailsModule { }
