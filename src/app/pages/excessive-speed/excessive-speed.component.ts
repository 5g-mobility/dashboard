import { Component, OnInit, AfterViewInit } from '@angular/core';
import Chart from 'chart.js';
import * as L from "leaflet";
import "leaflet-extra-markers/dist/js/leaflet.extra-markers.js";
import { NgbDate, NgbCalendar, NgbDateParserFormatter, NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-excessive-speed',
  templateUrl: './excessive-speed.component.html',
  styleUrls: ['./excessive-speed.component.scss']
})
export class ExcessiveSpeedComponent implements OnInit, AfterViewInit {
  private map;

  selectionMap = 0;

  hoveredDate: NgbDate | null = null;
  fromDate: NgbDate | null;
  toDate: NgbDate | null;

  private initMap(): void {
    this.map = L.map('map', {
      center: [40.625535, -8.729230],
      zoom: 14
    });

    const tiles = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: 'edupala.com'
    }).addTo(this.map);

    tiles.addTo(this.map);
  }

  constructor(private calendar: NgbCalendar, public formatter: NgbDateParserFormatter) {
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

  ngOnInit(): void {

    var speedCanvas = document.getElementById("dailyExcessiveChart");

    var dataEventNumber = {
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

    var dataTopSpeed = {
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

    var dailyData = {
      labels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10",
        "11", "12", "13", "14", "15", "16", "17", "18", "19", "20",
        "21", "22", "23", "24", "25", "26", "27", "28", "29", "30",
        "31"],
      datasets: [dataEventNumber, dataTopSpeed]
    };

    var chartOptions = {
      legend: {
        display: true,
        position: 'bottom'
      }
    };

    var lineChart = new Chart(speedCanvas, {
      type: 'line',
      hover: false,
      data: dailyData,
      options: chartOptions,
    });
  }

  ngAfterViewInit(): void {
    this.initMap();
    const redMarker = (L as any).ExtraMarkers.icon({
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

    const marker = L.marker([40.629779, -8.737498], { icon: redMarker });

    marker.bindPopup('<div class="marker_car"><h6 style="text-align: center;">Timestamp</h6><p style="margin-top: 0px;text-align: center;">09/04/2021 00:55</p></div>' + '<div class="marker_car"><h6 style="text-align: center;">Speed</h6><p style="margin-top: 0px;text-align: center;">180 km/h</p></div>');


    marker.addTo(this.map);
  }

}
