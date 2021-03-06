import { Routes } from '@angular/router';

import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { NotificationsComponent } from '../../pages/notifications/notifications.component';
import { ExcessiveSpeedComponent } from 'app/pages/excessive-speed/excessive-speed.component';
import { ConditionsComponent } from 'app/pages/conditions/conditions.component';
import { RoadInfoComponent } from 'app/pages/road-info/road-info.component';
import { EventComponent } from 'app/pages/event/event.component';

export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard',      component: DashboardComponent },
    { path: 'notifications',  component: NotificationsComponent },
    { path: 'excessive_speed', component: ExcessiveSpeedComponent },
    { path: 'conditions',     component: ConditionsComponent },
    { path: 'event',       component: EventComponent},
    { path: 'road_info',       component: RoadInfoComponent},
];
