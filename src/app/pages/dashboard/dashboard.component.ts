import {Component, OnDestroy, OnInit} from '@angular/core';

import Chart from 'chart.js';
import {EventService} from '../../services/event/event.service';
import {
  faCloudShowersHeavy, faLeaf, faCloudSun, faSun, faMoon, faRoad, faCloudMoonRain, faVideo, faExclamationTriangle, faCar, faWalking,
  faChartLine, faExclamation
} from '@fortawesome/free-solid-svg-icons';
import {ClimateService} from '../../services/climate/climate.service';
import {DailyInflowService} from '../../services/daily-inflow/daily-inflow.service';
import {timer} from 'rxjs';
import {Climate} from '../../models/climate';
import {MiscellaneousService} from '../../services/miscellaneous/miscellaneous.service';
import {CarbonFootprint} from '../../models/carbon-footprint';
import {faSmog} from '@fortawesome/free-solid-svg-icons/faSmog';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  rainIcon = faCloudShowersHeavy;
  leafIcon = faLeaf;
  cleanSkies = faSun;
  moonIcon = faMoon;
  foggy = faSmog;
  road = faRoad;
  conditions = faCloudMoonRain;
  camera = faVideo;
  danger = faExclamationTriangle;
  car = faCar;
  person = faWalking;
  max = faChartLine;
  rn = faExclamation;
  public canvas: any;
  public ctx;
  public chartColor;
  public chartEmail;
  public chartHours;
  private subscription;
  carbonFootprintCostaNova: CarbonFootprint;
  carbonFootprintBarra: CarbonFootprint;
  ultimoClimateBA: Climate;
  ultimoClimateCN: Climate;
  conditionBA: string;
  conditionCN: string;
  dataAtualWeather: String;
  events: Event[] = [];

  constructor( private eventService: EventService, private climateService: ClimateService, private dailyService: DailyInflowService,
               private miscellaneousService: MiscellaneousService, private spinner: NgxSpinnerService ) {
  }


  getConditions() {
    this.climateService.getBarraClimate().subscribe(
      dataBA => {
        this.ultimoClimateBA = dataBA.results[0];

        // condition Barra
        if (this.ultimoClimateBA.condition === 'FG') {
          this.conditionBA = 'Foggy';
        } else if (this.ultimoClimateBA.condition === 'RN') {
          this.conditionBA = 'Rainy';
        } else if (this.ultimoClimateBA.condition === 'CL') {
          this.conditionBA = 'Clean Skies';
        }
        this.dataAtualWeather = new Date().toLocaleTimeString();
        this.checkAllDoneLoading();

      }
    );

    this.climateService.getCostaNovaClimate().subscribe(dataCN => {
      this.ultimoClimateCN = dataCN.results[0];

      // condition Barra
      if (this.ultimoClimateCN.condition === 'FG') {
        this.conditionCN = 'Foggy';
      } else if (this.ultimoClimateCN.condition === 'RN') {
        this.conditionCN = 'Rainy';
      } else if (this.ultimoClimateCN.condition === 'CL') {
        this.conditionCN = 'Clean Skies';
      }

      this.checkAllDoneLoading();
    })

  }

  checkAllDoneLoading() {
    if (this.carbonFootprintCostaNova !== undefined && this.carbonFootprintBarra !== undefined && this.ultimoClimateBA !== undefined
      && this.ultimoClimateCN !== undefined) {
      this.spinner.hide();
    }
  }

  getCO2Barra() {
    this.miscellaneousService.getCarbonFootprint('BA').subscribe(data => {
      this.carbonFootprintBarra = data;
      this.checkAllDoneLoading();
    });

  }

  getCO2CostaNova() {
    this.miscellaneousService.getCarbonFootprint('CN').subscribe(data => {
      this.carbonFootprintCostaNova = data;
      this.checkAllDoneLoading();
    });

  }

    ngOnInit() {

      this.spinner.show();

      this.subscription = timer(0, 30000).subscribe(() => {
        // para a parte das conditions
        this.getConditions();
        this.getCO2Barra();
        this.getCO2CostaNova();

      });

    }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
