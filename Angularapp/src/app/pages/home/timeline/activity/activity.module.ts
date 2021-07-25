import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ActivityRoutingModule } from './activity-routing.module';
import { ActivityComponent } from './activity.component';

@NgModule({
  imports: [
    CommonModule,
    ActivityRoutingModule
  ],
  declarations: [ActivityComponent]
})
export class ActivityModule { }
