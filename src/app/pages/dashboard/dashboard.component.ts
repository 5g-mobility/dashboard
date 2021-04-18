import { Component, OnInit } from '@angular/core';
import { faCloudShowersHeavy, faLeaf, faCloudSun, faSun, faMoon, faRoad, faCloudMoonRain, faVideo, faExclamationTriangle, faCar, faWalking,
  faChartLine, faExclamation } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  rainIcon = faCloudShowersHeavy;
  leafIcon = faLeaf;
  sunCloudIcon = faCloudSun;
  sunIcon = faSun;
  road = faRoad;
  conditions = faCloudMoonRain;
  camera = faVideo;
  danger = faExclamationTriangle;
  car = faCar;
  person = faWalking;
  max = faChartLine;
  rn = faExclamation;

  constructor() { }

  ngOnInit(): void {
  }

}
