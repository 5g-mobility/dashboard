import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js';
import { NgbDate, NgbCalendar, NgbDateParserFormatter, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { faWalking, faBiking, faDog, faExclamationTriangle, faClock, faTruck, faCarSide, faMotorcycle, faTachometerAlt } from '@fortawesome/free-solid-svg-icons';
import {EventService} from '../../services/event/event.service';
import {stringify} from '@angular/compiler/src/util';
import {time} from 'ionicons/icons';
import {DailyInflowService} from '../../services/daily-inflow/daily-inflow.service';

@Component({
  selector: 'app-road-info',
  templateUrl: './road-info.component.html',
  styleUrls: ['./road-info.component.scss']
})
export class RoadInfoComponent implements OnInit {
  walkingIcon = faWalking;
  bikeIcon = faBiking;
  dogIcon = faDog;
  clockIcon = faClock;
  truckIcon = faTruck;
  carSideIcon = faCarSide;
  motorcycleIcon = faMotorcycle;
  speedIcon = faTachometerAlt;
  exclamationTriangleIcon = faExclamationTriangle;
  public ctx;
  public canvas: any;
  public chartCars;
  labelTopSpeeds: string[] = [];

  locationBttn = 0
  hrs24Bttn = 0

  event_by_day_speed: Map<string, number[]> = new Map()
  maxSpeedSumary: number[] = [];

  maxBACars: number[] = [];
  maxCNCars: number[] = [];
  maxLabels: string[] = [];

  circulatingCA: number;
  circulatingTR: number;
  circulatingMC: number;
  circulatingData: number[] = [];

  hoveredDate: NgbDate | null = null;

  fromDate: NgbDate | null;
  toDate: NgbDate | null;


  constructor(private eventService: EventService, private dailyService: DailyInflowService, private calendar: NgbCalendar, public formatter: NgbDateParserFormatter) {
    this.fromDate = new NgbDate(2021, 4, 10)
    this.toDate = new NgbDate(2021, 5, 10)
  }

  Barra() {
    console.log('barra')

  }

  Ria() {
    console.log('ria')
  }

  Duna() {
    console.log('duna')
  }



  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date && date.after(this.fromDate)) {
      this.toDate = date;
    } else {
      this.fromDate = date;
      this.toDate = null;
    }

    this.maxSpeedSumary = []
    this.labelTopSpeeds = []
    this.maxCNCars = []
    this.maxLabels = []
    this.maxBACars = []
    this.event_by_day_speed = new Map()

    this.fetchTopSpeedSumaryData()
    this.fetchMaxCarsInfo()

    this.constructTopSpeedGraph()
    this.constructMaxCarsGraph()
  }


  fetchTopSpeedSumaryData(): void {
    // CURL EXAMPLE:
    // "http://localhost:8000/5g-mobility/event/?timestamp__lte=2021-04-16T00:00&timestamp__gte=2021-04-14T00:00"

    const from = this.fromDate.year + '-' + this.fromDate.month + '-' + this.fromDate.day + 'T00:00'
    const to = this.toDate.year + '-' + this.toDate.month + '-' + this.toDate.day + 'T00:00'

    this.eventService.getEventBetweenDates(from, to).subscribe(
    data => {
      data.results.forEach(
        e => {
          const timestamp = stringify(e.timestamp).slice(0, 10)
          if (!this.event_by_day_speed.has(timestamp)) {
            this.event_by_day_speed.set(timestamp, [e.velocity])
          } else {
            this.event_by_day_speed.get(timestamp).push(e.velocity)
          }
        }
      );
      this.event_by_day_speed.forEach((v, k) => {
        const arr = this.event_by_day_speed.get(k)
        const max = Math.max.apply(Math, arr)
        this.maxSpeedSumary.push(max)
        this.labelTopSpeeds.push(k.slice(8, 10))
      })

      this.maxSpeedSumary = this.maxSpeedSumary.reverse()
      this.labelTopSpeeds = this.labelTopSpeeds.reverse()
    }
    )

  }

  fetchMaxCarsInfo() {
    const from = this.fromDate.year + '-' + this.fromDate.month + '-' + this.fromDate.day
    const to = this.toDate.year + '-' + this.toDate.month + '-' + this.toDate.day

    this.dailyService.getTrafficBA_betweenDates(from, to).subscribe(
      data => {
        data.results.forEach(
          r => {
            if (r.location === 'BA') {
              this.maxBACars.push(r.maximum)
            } else {
              this.maxCNCars.push(r.maximum)
              this.maxLabels.push(r.date.slice(8, 10))
            }

          }
        );
        this.maxLabels = this.maxLabels.reverse()
        this.maxBACars = this.maxBACars.reverse()
        this.maxCNCars = this.maxCNCars.reverse()
      }
    )

  }

  constructMaxCarsGraph() {
    const speedCanvas = document.getElementById('dailyInflowTraffic');

    const BA = {
      data: this.maxBACars,
      fill: false,
      label: 'Max Number of Cars - Praia da Barra',
      borderColor: '#fbc658',
      backgroundColor: 'transparent',
      pointBorderColor: '#fbc658',
      pointRadius: 4,
      pointHoverRadius: 4,
      pointBorderWidth: 8,
    };

    const CN = {
      data: this.maxCNCars,
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
      labels: this.maxLabels,
      datasets: [BA, CN]
    };

    const chartOptions = {
      legend: {
        display: true,
        position: 'bottom',
      }
    };

    const lineChart = new Chart(speedCanvas, {
      type: 'line',
      hover: false,
      data: dailyData,
      options: chartOptions,
    });

  }

  constructTopSpeedGraph() {
    const topSpeedCanvas = document.getElementById('topSpeedGraph');

    const dataTopSpeed = {
      data: this.maxSpeedSumary,
      fill: false,
      label: 'Max Speed of The Day',
      borderColor: '#EF8157',
      backgroundColor: 'transparent',
      pointBorderColor: '#EF8157',
      pointRadius: 4,
      pointHoverRadius: 4,
      pointBorderWidth: 8
    };

    const dailyData = {
      labels: this.labelTopSpeeds,
      datasets: [dataTopSpeed]
    };

    const chartOptions = {
      legend: {
        display: true,
        position: 'bottom',
      },
      scales: {
       yAxes: [{
          ticks: {
             max: 300,
             min: 0,
             stepSize: 50,
          }
       }]
    }
    };

    const lineChart = new Chart(topSpeedCanvas, {
      type: 'line',
      hover: false,
      data: dailyData,
      options: chartOptions,
    });
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

  fetchCirculatingVehiclesInfo() {
    // CURL: "http://localhost:8000/5g-mobility/event/?event_type=RT"
    this.eventService.getRoadTrafficEvents( 'CA' ).subscribe(
      data => {
        this.circulatingCA = data.results.length
      }
    )
    this.eventService.getRoadTrafficEvents( 'TR').subscribe(
      data => {
        this.circulatingTR = data.results.length
      }
    )
    this.eventService.getRoadTrafficEvents( 'MC').subscribe(
      data => {
        this.circulatingMC = data.results.length
      }
    )
  }

  constructCirculatingVehiclesGraph() {
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
          data: [1, 2, 3]
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

  ngOnInit(): void {
    this.fetchTopSpeedSumaryData()
    this.fetchMaxCarsInfo()
    this.fetchCirculatingVehiclesInfo()

    this.constructTopSpeedGraph()
    this.constructMaxCarsGraph()
    this.constructCirculatingVehiclesGraph()
  }

}
