import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { AdminLayoutRoutes } from './admin-layout.routing';

import { DashboardComponent }       from '../../pages/dashboard/dashboard.component';
import { UserComponent }            from '../../pages/user/user.component';
import { TableComponent }           from '../../pages/table/table.component';
import { TypographyComponent }      from '../../pages/typography/typography.component';
import { IconsComponent }           from '../../pages/icons/icons.component';
import { NotificationsComponent }   from '../../pages/notifications/notifications.component';
import { UpgradeComponent }         from '../../pages/upgrade/upgrade.component';


import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import { ConditionsComponent } from 'app/pages/conditions/conditions.component';
import { ExcessiveSpeedComponent } from 'app/pages/excessive-speed/excessive-speed.component';
import { RoadInfoComponent } from 'app/pages/road-info/road-info.component';
import { EventComponent } from 'app/pages/event/event.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    NgbModule,
    FormsModule, 
    ReactiveFormsModule,
    FontAwesomeModule
  ],
  declarations: [
    ConditionsComponent,
    DashboardComponent,
    EventComponent,
    ExcessiveSpeedComponent,
    RoadInfoComponent,
    UserComponent,
    TableComponent,
    UpgradeComponent,
    TypographyComponent,
    IconsComponent,
    NotificationsComponent,
  ]
})

export class AdminLayoutModule {}
