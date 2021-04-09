import { Component, OnInit } from '@angular/core';


export interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}

export const ROUTES: RouteInfo[] = [
    { path: '/dashboard',     title: 'Dashboard',         icon:'ion ion-md-stats',       class: '' },
    { path: '/excessive_speed',     title: 'Excessive Speed',         icon:'ion ion-md-speedometer',       class: '' },
    { path: '/conditions',     title: 'Conditions',         icon:'ion ion-md-cloud-circle',       class: '' },
    { path: '/icons',         title: 'Icons',             icon:'nc-icon nc-diamond',    class: '' },
    { path: '/notifications', title: 'Notifications',     icon:'nc-icon nc-bell-55',    class: '' },
    { path: '/user',          title: 'User Profile',      icon:'nc-icon nc-single-02',  class: '' },
    { path: '/table',         title: 'Table List',        icon:'nc-icon nc-tile-56',    class: '' },
    { path: '/typography',    title: 'Typography',        icon:'nc-icon nc-caps-small', class: '' },
];

@Component({
    moduleId: module.id,
    selector: 'sidebar-cmp',
    templateUrl: 'sidebar.component.html',
})

export class SidebarComponent implements OnInit {
    public menuItems: any[];
    ngOnInit() {
        this.menuItems = ROUTES.filter(menuItem => menuItem);
    }
}
