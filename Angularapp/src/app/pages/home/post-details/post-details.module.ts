import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PostDetailsRoutingModule } from './post-details-routing.module';
import { PostDetailsComponent } from './post-details.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PostDetailsRoutingModule
  ],
  declarations: [PostDetailsComponent]
})
export class PostDetailsModule { }
