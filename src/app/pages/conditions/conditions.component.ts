import { Component, OnInit, AfterViewInit } from '@angular/core';
import { faCloudShowersHeavy, faLeaf, faCloudSun, faSun, faMoon } from '@fortawesome/free-solid-svg-icons';
import * as L from "leaflet";
import "leaflet-extra-markers/dist/js/leaflet.extra-markers.js";
import Chart from 'chart.js';

@Component({
  selector: 'app-conditions',
  templateUrl: './conditions.component.html',
  styleUrls: ['./conditions.component.scss']
})
export class ConditionsComponent implements OnInit, AfterViewInit {
  rainIcon = faCloudShowersHeavy;
  leafIcon = faLeaf;
  sunCloudIcon = faCloudSun;
  sunIcon = faSun;
  moonIcon = faMoon;
  private map;
  selectionMap = 0
  public ctx;
  public canvas : any;
  public chartEmail;

  constructor() { }

  private initMap(): void {
    this.map = L.map('mapConditions', {
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

  ngOnInit(): void {
    this.canvas = document.getElementById("chartBarra");
      this.ctx = this.canvas.getContext("2d");
      this.chartEmail = new Chart(this.ctx, {
        type: 'pie',
        data: {
          labels: [1, 2, 3],
          datasets: [{
            label: "Emails",
            pointRadius: 0,
            pointHoverRadius: 0,
            backgroundColor: [
              '#4acccd',
              '#fcc468',
              '#ef8157'
            ],
            borderWidth: 0,
            data: [300, 500, 200]
          }]
        },

        options: {

          legend: {
            display: false
          },

          pieceLabel: {
            render: 'percentage',
            fontColor: ['white'],
            precision: 2
          },

          tooltips: {
            enabled: false
          },

          scales: {
            yAxes: [{

              ticks: {
                display: false
              },
              gridLines: {
                drawBorder: false,
                zeroLineColor: "transparent",
                color: 'rgba(255,255,255,0.05)'
              }

            }],

            xAxes: [{
              barPercentage: 1.6,
              gridLines: {
                drawBorder: false,
                color: 'rgba(255,255,255,0.1)',
                zeroLineColor: "transparent"
              },
              ticks: {
                display: false,
              }
            }]
          },
        }
      });

      this.canvas = document.getElementById("chartCostaNova");
      this.ctx = this.canvas.getContext("2d");
      this.chartEmail = new Chart(this.ctx, {
        type: 'pie',
        data: {
          labels: [1, 2, 3],
          datasets: [{
            label: "Emails",
            pointRadius: 0,
            pointHoverRadius: 0,
            backgroundColor: [
              '#4acccd',
              '#fcc468',
              '#ef8157'
            ],
            borderWidth: 0,
            data: [400, 200, 400]
          }]
        },

        options: {

          legend: {
            display: false
          },

          pieceLabel: {
            render: 'percentage',
            fontColor: ['white'],
            precision: 2
          },

          tooltips: {
            enabled: false
          },

          scales: {
            yAxes: [{

              ticks: {
                display: false
              },
              gridLines: {
                drawBorder: false,
                zeroLineColor: "transparent",
                color: 'rgba(255,255,255,0.05)'
              }

            }],

            xAxes: [{
              barPercentage: 1.6,
              gridLines: {
                drawBorder: false,
                color: 'rgba(255,255,255,0.1)',
                zeroLineColor: "transparent"
              },
              ticks: {
                display: false,
              }
            }]
          },
        }
      });

  }

  ngAfterViewInit(): void {
    this.initMap();
    var redMarker = (L as any).ExtraMarkers.icon({
      shape: 'circle',
      markerColor: 'blue-dark',
      prefix: 'fa',
      icon: 'fa-tint',
      iconColor: '#fff',
      iconRotate: 0,
      extraClasses: '',
      number: '',
      svg: true
    });

    var marker = L.marker([40.629779, -8.737498], { icon: redMarker });
    marker.bindPopup('<div class="marker_car"><h6 style="text-align: center;">Timestamp</h6><p style="margin-top: 0px;text-align: center;">09/04/2021 00:55</p></div>' + '<div class="marker_car"><h6 style="text-align: center;">Type</h6><p style="margin-top: 0px;text-align: center;">Rain Detected</p></div>');
    marker.addTo(this.map);

    var redMarker = (L as any).ExtraMarkers.icon({
      shape: 'circle',
      markerColor: 'blue-dark',
      prefix: 'fa',
      icon: 'fa-cloud',
      iconColor: '#fff',
      iconRotate: 0,
      extraClasses: '',
      number: '',
      svg: true
    });

    marker = L.marker([40.629779, -8.746988], { icon: redMarker });
    marker.bindPopup('<div class="marker_car"><h6 style="text-align: center;">Timestamp</h6><p style="margin-top: 0px;text-align: center;">09/04/2021 00:58</p></div>' + '<div class="marker_car"><h6 style="text-align: center;">Type</h6><p style="margin-top: 0px;text-align: center;">Fog Detected</p></div>');
    marker.addTo(this.map);
  }

}
