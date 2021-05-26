import {Component, OnDestroy, OnInit} from '@angular/core';
import Chart from 'chart.js';
import {NgbDate, NgbCalendar, NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';
import {
  faWalking,
  faBiking,
  faDog,
  faExclamationTriangle,
  faClock,
  faCarSide,
  faTachometerAlt,
  faCheck,
  faCar,
  faQuestion
} from '@fortawesome/free-solid-svg-icons';
import {MiscellaneousService} from '../../services/miscellaneous/miscellaneous.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {timer} from 'rxjs';
import {EventService} from '../../services/event/event.service';

@Component({
  selector: 'app-road-info',
  templateUrl: './road-info.component.html',
  styleUrls: ['./road-info.component.scss']
})
export class RoadInfoComponent implements OnInit, OnDestroy {
  walkingIcon = faWalking;
  bikeIcon = faBiking;
  checkMarkIcon = faCheck;
  carIcon = faCar;
  questionMarkIcon = faQuestion;
  dogIcon = faDog;
  clockIcon = faClock;
  carSideIcon = faCarSide;
  speedIcon = faTachometerAlt;
  exclamationTriangleIcon = faExclamationTriangle;
  public ctx;
  public canvas: any;
  public chartCars;
  private subscription;
  private subscription1;
  selectedLocation = 'PT';
  selectedDate = 0;
  animalsBikeLanes: Number;
  peopleBikeLanes: Number;
  bikesBikeLanes: Number;
  dataBikeLanesUpdate: String;
  lastRoadDanger: Event;
  carsChartData: number[];
  dataCarsChartUpdate: String;
  lastMonthTopSpeedPT: number[] = [];
  lastMonthTopSpeedRA: number[] = [];
  lastMonthTopSpeedDN: number[] = [];
  lastMonthTopSpeedDate: string[] = [];
  buildingChartSpeed = true;
  buildingChartTraffic = true;
  lastMonthTrafficBA: number[] = [];
  lastMonthTrafficCN: number[] = [];
  lastMonthTrafficDate: string[] = [];

  hoveredDate: NgbDate | null = null;
  fromDate: NgbDate | null = null;
  toDate: NgbDate | null = null;


  constructor(private miscellaneousService: MiscellaneousService, private calendar: NgbCalendar,
              public formatter: NgbDateParserFormatter, private spinner: NgxSpinnerService,
              private eventService: EventService) {
    this.fromDate = null;
    this.toDate = null;
  }

  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
      this.updateInfo();
    } else if (this.fromDate && !this.toDate && date && date.after(this.fromDate)) {
      this.toDate = date;
      this.updateInfo();
    } else {
      this.fromDate = date;
      this.toDate = null;
    }
  }

  buildCarsChart() {
    this.canvas = document.getElementById('chartCars');
    this.ctx = this.canvas.getContext('2d');
    this.chartCars = new Chart(this.ctx, {
      type: 'pie',
      data: {
        labels: ['Cars', 'Trucks', 'Motorcycles'],
        datasets: [{
          label: 'Cars',
          pointRadius: 0,
          pointHoverRadius: 0,
          backgroundColor: [
            '#4acccd',
            '#fcc468',
            '#ef8157'
          ],
          borderWidth: 0,
          data: this.carsChartData
        }]
      },

      options: {

        legend: {
          display: true
        },

        pieceLabel: {
          render: 'percentage',
          fontColor: ['white'],
          precision: 2
        },

        tooltips: {
          enabled: true
        },

        scales: {
          yAxes: [{

            ticks: {
              display: false
            },
            gridLines: {
              drawBorder: true,
              zeroLineColor: 'transparent',
              color: 'rgba(255,255,255,0.05)'
            }

          }],

          xAxes: [{
            barPercentage: 1.6,
            gridLines: {
              drawBorder: false,
              color: 'rgba(255,255,255,0.1)',
              zeroLineColor: 'transparent'
            },
            ticks: {
              display: false,
            }
          }]
        },
      }
    });
  }

  buildChartTopSpeed() {
    const topSpeedCanvas = document.getElementById('topSpeedGraph');

    const dataTopSpeedPT = {
      data: this.lastMonthTopSpeedPT,
      fill: false,
      label: 'Max Speed of The Day - Ponte da Barra',
      borderColor: '#EF8157',
      backgroundColor: 'transparent',
      pointBorderColor: '#EF8157',
      pointRadius: 4,
      pointHoverRadius: 4,
      pointBorderWidth: 8
    };

    const dataTopSpeedDN = {
      data: this.lastMonthTopSpeedDN,
      fill: false,
      label: 'Max Speed of The Day - Duna',
      borderColor: '#fbc658',
      backgroundColor: 'transparent',
      pointBorderColor: '#fbc658',
      pointRadius: 4,
      pointHoverRadius: 4,
      pointBorderWidth: 8
    };

    const dataTopSpeedRA = {
      data: this.lastMonthTopSpeedRA,
      fill: false,
      label: 'Max Speed of The Day - Ria Ativa',
      borderColor: '#51CACF',
      backgroundColor: 'transparent',
      pointBorderColor: '#51CACF',
      pointRadius: 4,
      pointHoverRadius: 4,
      pointBorderWidth: 8
    };

    const dailyData = {
      labels: this.lastMonthTopSpeedDate,
      datasets: [dataTopSpeedPT, dataTopSpeedDN, dataTopSpeedRA]
    };

    const chartOptions = {
      legend: {
        display: true,
        position: 'bottom',
      }
    };

    const lineChart = new Chart(topSpeedCanvas, {
      type: 'line',
      hover: false,
      data: dailyData,
      options: chartOptions,
    });
    this.buildingChartSpeed = false;
    this.checkAllDoneLoading();
  }

  buildChartTrafficInflow() {
    const dailyCanvas = document.getElementById('dailyInflowTraffic');

    const dataMaxCarsBA = {
      data: this.lastMonthTrafficBA,
      fill: false,
      label: 'Max Number of Cars - Praia da Barra',
      borderColor: '#fbc658',
      backgroundColor: 'transparent',
      pointBorderColor: '#fbc658',
      pointRadius: 4,
      pointHoverRadius: 4,
      pointBorderWidth: 8,
    };

    const dataMaxCarsCN = {
      data: this.lastMonthTrafficCN,
      fill: false,
      label: 'Max Number of Cars - Costa Nova',
      borderColor: '#51CACF',
      backgroundColor: 'transparent',
      pointBorderColor: '#51CACF',
      pointRadius: 4,
      pointHoverRadius: 4,
      pointBorderWidth: 8
    };

    const dailyData = {
      labels: this.lastMonthTrafficDate,
      datasets: [dataMaxCarsBA, dataMaxCarsCN]
    };

    const chartOptions = {
      legend: {
        display: true,
        position: 'bottom',
      }
    };

    const lineChart = new Chart(dailyCanvas, {
      type: 'line',
      hover: false,
      data: dailyData,
      options: chartOptions,
    });

    this.buildingChartTraffic = false;
    this.checkAllDoneLoading();
  }

  getTrafficChartData() {
    this.miscellaneousService.getMaxTrafficInflowSummary().subscribe(data => {
      this.lastMonthTrafficDate = [];
      this.lastMonthTrafficBA = [];
      this.lastMonthTrafficCN = [];
      const keys = Object.keys(data);
      keys.forEach(item => {
        const dateKeys = Object.keys(data[item]).reverse();
        dateKeys.forEach(date => {
          if (item === 'CN') {
            this.lastMonthTrafficCN.push(data[item][date]);
            this.lastMonthTrafficDate.push(date.substring(0, 5));
          }
          if (item === 'BA') {
            this.lastMonthTrafficBA.push(data[item][date]);
          }

        })
      });
      this.buildChartTrafficInflow();
    });
  }

  getTopSpeedChartData() {
    this.miscellaneousService.getTopSpeedSummary().subscribe(data => {
      this.lastMonthTopSpeedPT = [];
      this.lastMonthTopSpeedDN = [];
      this.lastMonthTopSpeedRA = [];
      this.lastMonthTopSpeedDate = [];
      const keys = Object.keys(data);
      keys.forEach(item => {
        const dateKeys = Object.keys(data[item]).reverse();
        dateKeys.forEach(date => {
          if (item === 'PT') {
            this.lastMonthTopSpeedPT.push(data[item][date]);
            this.lastMonthTrafficDate.push(date.substring(0, 5));
          }
          if (item === 'DN') {
            this.lastMonthTopSpeedDN.push(data[item][date]);
          }
          if (item === 'RA') {
            this.lastMonthTopSpeedRA.push(data[item][date]);
          }

        })
      });
      this.buildChartTopSpeed();
    });
  }

  getCarChartData() {
    this.miscellaneousService.getCarsChartInfo(this.selectedLocation, this.fromDate, this.toDate).subscribe(data => {
      this.carsChartData = [data.cars, data.trucks, data.motorcycles];
      this.buildCarsChart();
      this.dataCarsChartUpdate = new Date().toLocaleTimeString();
      this.checkAllDoneLoading();
    })
  }

  updateInfo(lastDay: boolean = false) {
    if (lastDay) {
      this.fromDate = null;
      this.toDate = null;
    }
    this.getBikeLanesInfo();
    this.getLastRoadDanger();
    this.getCarChartData();
  }

  isHovered(date: NgbDate) {
    return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
  }

  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return date.equals(this.fromDate) || (this.toDate && date.equals(this.toDate)) || this.isInside(date) || this.isHovered(date);
  }

  validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
    const parsed = this.formatter.parse(input);
    return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
  }

  getBikeLanesInfo() {
    this.miscellaneousService.getBikeLanesInfo(this.selectedLocation, this.fromDate, this.toDate).subscribe(
      data => {
        this.peopleBikeLanes = Number(data.people);
        this.animalsBikeLanes = data.animals;
        this.bikesBikeLanes = data.bikes;
        this.dataBikeLanesUpdate = new Date().toLocaleTimeString();
        this.checkAllDoneLoading();
      }
    );
  }

  getLastRoadDanger() {
    this.eventService.getLastRoadDanger(this.selectedLocation, this.fromDate, this.toDate).subscribe(data => {
      this.lastRoadDanger = data.results[0];

      if (this.lastRoadDanger === undefined) {
        this.lastRoadDanger = null;
      }

      this.checkAllDoneLoading();
    })
  }

  checkAllDoneLoading() {
    if (this.peopleBikeLanes !== undefined && this.animalsBikeLanes !== undefined && this.bikesBikeLanes !== undefined &&
      this.lastRoadDanger !== undefined && this.carsChartData !== undefined && this.lastMonthTopSpeedDate !== undefined &&
      this.lastMonthTrafficDate !== undefined && this.buildingChartSpeed === false && this.buildingChartTraffic === false) {
      this.spinner.hide();
    }
  }

  ngOnInit(): void {
    this.spinner.show();
    this.subscription = timer(0, 30000).subscribe(() => {
      this.updateInfo();
    });

    this.subscription1 = timer(0, 60000).subscribe(() => {
      this.getTopSpeedChartData();
      this.getTrafficChartData();
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.subscription1.unsubscribe();
  }

}
