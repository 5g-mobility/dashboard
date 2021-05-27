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
import {DailyInflow} from '../../models/daily-inflow';
import {TrafficInfo} from '../../models/traffic-info';

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
  public chartHours;
  private subscription;
  carbonFootprintCostaNova: CarbonFootprint;
  carbonFootprintBarra: CarbonFootprint;
  ultimoClimateBA: Climate;
  ultimoClimateCN: Climate;
  ultimoDailyInflowBA: DailyInflow;
  ultimoDailyInflowCN: DailyInflow;
  conditionBA: string;
  conditionCN: string;
  dataAtualWeather: String;
  dataAtualDailyInflow: String;
  currentTrafficInfoPT: TrafficInfo;
  currentTrafficInfoDN: TrafficInfo;
  currentTrafficInfoRA: TrafficInfo;
  dataCurrentTrafficInfo: String;
  eventOverviewText: String;
  eventOverviewValue: String;
  dataEventsOverview: String;
  events: Event[] = [];

  constructor( private eventService: EventService, private climateService: ClimateService, private dailyService: DailyInflowService,
               private miscellaneousService: MiscellaneousService, private spinner: NgxSpinnerService ) {
  }

  getCurrentTrafficInfo() {
    this.miscellaneousService.getCurrentTrafficIndo().subscribe(
      data => {
        this.currentTrafficInfoPT = data['PT'];
        this.currentTrafficInfoDN = data['DN'];
        this.currentTrafficInfoRA = data['RA'];

        [this.currentTrafficInfoPT, this.currentTrafficInfoDN, this.currentTrafficInfoRA].forEach(traffic => {
          if (traffic.traffic === 'Flowing Normally') {
            traffic.color = 'green';
          } else if (traffic.traffic === 'Excessive Speed') {
            traffic.color = 'red';
          } else if (traffic.traffic === 'Slow') {
            traffic.color = '#fd7e14';
          }

        })

        this.dataCurrentTrafficInfo = new Date().toLocaleTimeString();
        this.checkAllDoneLoading();
      })
  }

  getEventsOverview() {
    this.miscellaneousService.getRandomEventsOverview().subscribe(
      data => {
        this.eventOverviewText = data.text;
        this.eventOverviewValue = data.value;

        this.dataEventsOverview = new Date().toLocaleTimeString();
        this.checkAllDoneLoading();

      }
    );
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

      this.dataAtualDailyInflow = new Date().toLocaleTimeString();
      this.checkAllDoneLoading();
    })

  }


  getDailyInflow() {
    this.dailyService.getTodayDailyInflowBarra().subscribe(
      dataBA => {
        this.ultimoDailyInflowBA = dataBA.results[0];

        this.dataAtualDailyInflow = new Date().toLocaleTimeString();
        this.checkAllDoneLoading();

      }
    );

    this.dailyService.getTodayDailyInflowCosta().subscribe(dataCN => {
      this.ultimoDailyInflowCN = dataCN.results[0];

      this.dataAtualDailyInflow = new Date().toLocaleTimeString();
      this.checkAllDoneLoading();
    })

  }

  checkAllDoneLoading() {
    if (this.carbonFootprintCostaNova !== undefined && this.carbonFootprintBarra !== undefined && this.ultimoClimateBA !== undefined
      && this.ultimoClimateCN !== undefined && this.ultimoDailyInflowCN !== undefined && this.ultimoDailyInflowBA !== undefined &&
      this.dataCurrentTrafficInfo !== undefined && this.dataEventsOverview !== undefined) {
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
        this.getDailyInflow()
        this.getCurrentTrafficInfo()
        this.getEventsOverview();

      });

    }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
