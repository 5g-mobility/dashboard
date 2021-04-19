import { Component, OnInit } from '@angular/core';


type eventType = Array<{timestamp: string, location: string, type: string, class: string, speed?: number, geolocation?: string, co2?: number}>;


@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss']
})
export class EventComponent implements OnInit {
  selectionMap = 0;

  events: eventType = [
    {timestamp: new Date().toLocaleString(), location: 'Ria Ativa', type: 'Road Danger', class: 'Stopped Car', speed: 0 },
    {timestamp: new Date().toLocaleString(), location: 'A25 Aveiro', type: 'Bike Lanes', class: 'Person', speed: 2 },
    {timestamp: new Date().toLocaleString(), location: 'Duna', type: 'Road Traffic', class: 'Car', speed: 184 },
    {timestamp: new Date().toLocaleString(), location: 'Costa Nova', type: 'Conditions', class: 'Fog'},
    {timestamp: new Date().toLocaleString(), location: 'Barra', type: 'Carbon Footprint', class: 'Car', speed: 97, geolocation: '40° 38′ 32 N, 8° 44′ 56', co2: 5},
    {timestamp: new Date().toLocaleString(), location: 'A25 Aveiro', type: 'Conditions', class: 'Rain'},
    {timestamp: new Date().toLocaleString(), location: 'A25 Aveiro', type: 'Road Traffic', class: 'Motorcycle', speed: 100 },
  ]

  constructor() { }

  ngOnInit(): void {
  }

}
