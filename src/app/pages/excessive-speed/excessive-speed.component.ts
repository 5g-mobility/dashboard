import {Component, OnInit, AfterViewInit, OnDestroy} from '@angular/core';
import Chart from 'chart.js';
import * as L from 'leaflet';
import 'leaflet-extra-markers/dist/js/leaflet.extra-markers.js';
import {NgbDate, NgbCalendar, NgbDateParserFormatter, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {interval, timer} from 'rxjs';
import {ClimateService} from '../../services/climate/climate.service';
import {EventService} from '../../services/event/event.service';
import {MiscellaneousService} from '../../services/miscellaneous/miscellaneous.service';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
  selector: 'app-excessive-speed',
  templateUrl: './excessive-speed.component.html',
  styleUrls: ['./excessive-speed.component.scss']
})
export class ExcessiveSpeedComponent implements OnInit, AfterViewInit, OnDestroy {
  private map;
  selectTime = 0;
  markers: any[] = [];
  hoveredDate: NgbDate | null = null;
  fromDate: NgbDate | null;
  toDate: NgbDate | null;
  dailyExcessiveSpeedNumber: number[] = [];
  dailyExcessiveSpeedTop: number[] = [];
  dailyExcessiveSpeedDate: string[] = [];
  private loadingMap = true;
  private subscription;
  private subscription2;

  carMarker = (L as any).ExtraMarkers.icon({
    shape: 'circle',
    markerColor: 'blue-dark',
    prefix: 'fa',
    icon: 'fa-car',
    iconColor: '#fff',
    iconRotate: 0,
    extraClasses: '',
    number: '',
    svg: true
  });

  private initMap(): void {
    this.map = L.map('map', {
      center: [40.625535, -8.729230],
      zoom: 14
    });

    const tiles = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: 'edupala.com'
    }).addTo(this.map);

    tiles.addTo(this.map);
  }

  constructor(private eventService: EventService, private climateService: ClimateService,
              private calendar: NgbCalendar, public formatter: NgbDateParserFormatter, private miscellaneousService: MiscellaneousService,
              private spinner: NgxSpinnerService) {
    this.fromDate = calendar.getToday();
    this.toDate = calendar.getNext(calendar.getToday(), 'd', 10);
  }

  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
      this.selectDate();
    } else if (this.fromDate && !this.toDate && date && date.after(this.fromDate)) {
      this.toDate = date;
      this.selectDate();
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
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

  getLast5min() {
    this.eventService.getExcessiveSpeedLast5Mins(50).subscribe(
      data => {
        this.markers = [];
        if (data.results.length !== 0) {
          data.results.forEach(d => {
            const marker = L.marker([d.latitude, d.longitude], {icon: this.carMarker});
            marker.bindPopup('<div class="marker_car"><h6 style="text-align: center;">Timestamp</h6><p style="margin-top: 0px;text-align: center;">' + d.timestamp + '</p></div>' + '<div class="marker_car"><h6 style="text-align: center;">Speed</h6><p style="margin-top: 0px;text-align: center;">' + d.velocity + ' km/h</p></div>');
            marker.addTo(this.map);
            this.markers.push(marker);
          })
        }

        this.loadingMap = false;
        this.checkAllDoneLoading();
      })
  }

  getEventsBetweenDates() {
    if (this.toDate != null && this.fromDate != null) {
      this.eventService.getExcessiveSpeedBetweenDates(this.fromDate, this.toDate, 50).subscribe(
        data => {
          this.markers = [];
          if (data.results.length !== 0) {
            data.results.forEach(d => {
              const marker = L.marker([d.latitude, d.longitude], {icon: this.carMarker});
              marker.bindPopup('<div class="marker_car"><h6 style="text-align: center;">Timestamp</h6><p style="margin-top: 0px;text-align: center;">' + d.timestamp + '</p></div>' + '<div class="marker_car"><h6 style="text-align: center;">Speed</h6><p style="margin-top: 0px;text-align: center;">' + d.velocity + ' km/h</p></div>');
              marker.addTo(this.map);
              this.markers.push(marker);
            })
          }

          this.loadingMap = false;
          this.checkAllDoneLoading();
        })
    }
  }

  getDailyExcessiveSpeed() {
    this.dailyExcessiveSpeedTop = [];
    this.dailyExcessiveSpeedDate = [];
    this.dailyExcessiveSpeedNumber = [];
    this.miscellaneousService.getDailyExcessiveSpeed().subscribe(data => {
      const keys = Object.keys(data).reverse();
      keys.forEach(item => {
        this.dailyExcessiveSpeedNumber.push(data[item]['number']);
        this.dailyExcessiveSpeedTop.push(data[item]['top']);
        this.dailyExcessiveSpeedDate.push(item.substring(0, 5));
      });
      this.createGraphEvents();
      this.createGraphSpeed();
      this.checkAllDoneLoading();
    });
  }

  checkAllDoneLoading() {
    if (this.dailyExcessiveSpeedDate.length > 0 && this.dailyExcessiveSpeedTop.length > 0
      && this.dailyExcessiveSpeedNumber.length > 0 && this.loadingMap === false) {
      this.spinner.hide();
    }
  }


  ngOnInit(): void {
    this.spinner.show()
    this.subscription = timer(0, 30000).subscribe(() => {
      if (this.selectTime === 0) {
        // ultimos 5 minutos
        this.last5min()
      } else {
        // selected date
        this.selectDate()
      }
    });

    this.subscription2 = timer(0, 30000).subscribe(() => {
        this.getDailyExcessiveSpeed();
      }
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.subscription2.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  last5min() {
    for (let i = 0; i < this.markers.length; i++) {
      this.map.removeLayer(this.markers[i]);
    }
    this.markers = []
    this.getLast5min();
  }

  selectDate() {
    for (let i = 0; i < this.markers.length; i++) {
      this.map.removeLayer(this.markers[i]);
    }
    this.markers = []
    this.getEventsBetweenDates();
  }


  createGraphEvents() {
    const speedCanvas = document.getElementById('dailyExcessiveEventsChart');

    const dataEventNumber = {
      data: this.dailyExcessiveSpeedNumber,
      fill: false,
      label: 'Number of Excessive Speed Events of The Day',
      borderColor: '#fbc658',
      backgroundColor: 'transparent',
      pointBorderColor: '#fbc658',
      pointRadius: 4,
      pointHoverRadius: 4,
      pointBorderWidth: 8,
    };

    const dailyData = {
      labels: this.dailyExcessiveSpeedDate,
      datasets: [dataEventNumber]
    };

    const chartOptions = {
      legend: {
        display: true,
        position: 'bottom'
      }
    };

    const lineChart = new Chart(speedCanvas, {
      type: 'line',
      hover: false,
      data: dailyData,
      options: chartOptions,
    });
  }

  createGraphSpeed() {
    const speedCanvas = document.getElementById('dailyExcessiveSpeedChart');

    const dataTopSpeed = {
      data: this.dailyExcessiveSpeedTop,
      fill: false,
      label: 'Top Speed of The Day (km/h)',
      borderColor: '#51CACF',
      backgroundColor: 'transparent',
      pointBorderColor: '#51CACF',
      pointRadius: 4,
      pointHoverRadius: 4,
      pointBorderWidth: 8
    };

    const dailyData = {
      labels: this.dailyExcessiveSpeedDate,
      datasets: [dataTopSpeed]
    };

    const chartOptions = {
      legend: {
        display: true,
        position: 'bottom'
      }
    };

    const lineChart = new Chart(speedCanvas, {
      type: 'line',
      hover: false,
      data: dailyData,
      options: chartOptions,
    });
  }

}
