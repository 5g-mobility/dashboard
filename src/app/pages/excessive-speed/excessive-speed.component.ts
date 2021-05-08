import { Component, OnInit, AfterViewInit } from '@angular/core';
import Chart from 'chart.js';
import * as L from 'leaflet';
import 'leaflet-extra-markers/dist/js/leaflet.extra-markers.js';
import { NgbDate, NgbCalendar, NgbDateParserFormatter, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/internal/Observable';
import {timer} from 'rxjs';
import {ClimateService} from '../../services/climate/climate.service';
import {now} from 'moment';
import {EventService} from '../../services/event/event.service';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-excessive-speed',
  templateUrl: './excessive-speed.component.html',
  styleUrls: ['./excessive-speed.component.scss']
})
export class ExcessiveSpeedComponent implements OnInit, AfterViewInit {
  private map;
  selectTime = 0;
  markers: any[] = [];
  hoveredDate: NgbDate | null = null;
  fromDate: NgbDate | null;
  toDate: NgbDate | null;

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
              private calendar: NgbCalendar, public formatter: NgbDateParserFormatter) {
    this.fromDate = calendar.getToday();
    this.toDate = calendar.getNext(calendar.getToday(), 'd', 10);
  }

  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date && date.after(this.fromDate)) {
      this.toDate = date;
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
    this.eventService.getExcessiveSpeedLast5Mins().subscribe(
          data => data.results.forEach( d => {
                console.log(d)
                const marker = L.marker([d.latitude, d.longitude], { icon: this.carMarker });
                marker.bindPopup('<div class="marker_car"><h6 style="text-align: center;">Timestamp</h6><p style="margin-top: 0px;text-align: center;">' + d.timestamp + '</p></div>' + '<div class="marker_car"><h6 style="text-align: center;">Speed</h6><p style="margin-top: 0px;text-align: center;">' + d.velocity + ' km/h</p></div>');
                marker.addTo(this.map);
                this.markers.push(marker);
          })
        )
  }

  getEventsBetweenDates() {
    if (this.toDate != null && this.fromDate != null) {
      this.eventService.getExcessiveSpeedBetweenDates(this.fromDate, this.toDate).subscribe(
  data => data.results.forEach( d => {
        console.log(d)
        console.log(this.toDate, this.fromDate)
        const marker = L.marker([d.latitude, d.longitude], { icon: this.carMarker });
        marker.bindPopup('<div class="marker_car"><h6 style="text-align: center;">Timestamp</h6><p style="margin-top: 0px;text-align: center;">' + d.timestamp + '</p></div>' + '<div class="marker_car"><h6 style="text-align: center;">Speed</h6><p style="margin-top: 0px;text-align: center;">' + d.velocity + ' km/h</p></div>');
        marker.addTo(this.map);
        this.markers.push(marker);
      })
    )
    }
  }


  ngOnInit(): void {
    timer(0, 10000).subscribe( () => {
      if (this.selectTime === 0) {
        // ultimos 5 minutos
          this.getLast5min()
      } else {
        // selected date
        this.getEventsBetweenDates()
     }
    }
    )
  }

  ngAfterViewInit(): void {
    this.initMap();
    this.createGraph()
  }

  last5min() {
    console.log('last 5 min')
    for (let i = 0; i < this.markers.length; i++) {
      this.map.removeLayer(this.markers[i]);
    }
    this.markers = []
  }

  selectDate() {
    console.log('selecting date')
    for (let i = 0; i < this.markers.length; i++) {
      this.map.removeLayer(this.markers[i]);
    }
    this.markers = []
  }


  createGraph() {
    const speedCanvas = document.getElementById("dailyExcessiveChart");

    const dataEventNumber = {
      data: [0, 19, 15, 20, 30, 40, 40, 50, 25, 30, 50, 70, 0,
        19, 15, 20, 30, 40, 40, 50, 25, 30, 50, 70, 50, 20, 60,
        55, 76, 34, 21],
      fill: false,
      label: 'Number of Excessive Speed Events of The Day',
      borderColor: '#fbc658',
      backgroundColor: 'transparent',
      pointBorderColor: '#fbc658',
      pointRadius: 4,
      pointHoverRadius: 4,
      pointBorderWidth: 8,
    };

    const dataTopSpeed = {
      data: [150, 120, 95, 200, 220, 300, 93, 97, 100, 110, 99, 91, 102,
        145, 185, 170, 160, 112, 133, 141, 121, 105, 100, 96, 95, 91, 93,
        92, 97, 94, 91],
      fill: false,
      label: 'Top Speed of The Day',
      borderColor: '#51CACF',
      backgroundColor: 'transparent',
      pointBorderColor: '#51CACF',
      pointRadius: 4,
      pointHoverRadius: 4,
      pointBorderWidth: 8
    };

    const dailyData = {
      labels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10",
        "11", "12", "13", "14", "15", "16", "17", "18", "19", "20",
        "21", "22", "23", "24", "25", "26", "27", "28", "29", "30",
        "31"],
      datasets: [dataEventNumber, dataTopSpeed]
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
