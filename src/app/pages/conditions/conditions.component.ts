import {Component, OnInit, AfterViewInit, OnDestroy} from '@angular/core';
import {faCloudShowersHeavy, faLeaf, faCloudSun, faSun, faMoon} from '@fortawesome/free-solid-svg-icons';
import * as L from 'leaflet';
import 'leaflet-extra-markers/dist/js/leaflet.extra-markers.js';
import {NgbDate, NgbCalendar, NgbDateParserFormatter, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import Chart from 'chart.js';
import {timer} from 'rxjs';
import {Climate} from '../../models/climate';
import {ClimateService} from '../../services/climate/climate.service';
import {faSmog} from '@fortawesome/free-solid-svg-icons/faSmog';
import {EventService} from '../../services/event/event.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
  selector: 'app-conditions',
  templateUrl: './conditions.component.html',
  styleUrls: ['./conditions.component.scss']
})
export class ConditionsComponent implements OnInit, AfterViewInit, OnDestroy {
  rainy = faCloudShowersHeavy;
  leafIcon = faLeaf;
  sunCloudIcon = faCloudSun;
  cleanSkies = faSun;
  moonIcon = faMoon;
  foggy = faSmog;
  private map;
  dataSelection = 0;
  typeSelection = 0;
  filterToSearch: String = '';
  public ctx;
  public canvas: any;
  public chartEmail;
  public radioGroupForm: FormGroup;
  private subscription;
  starting = true;


  mapMarkers: any[] = [];
  ultimoClimateBA: Climate;
  ultimoClimateCN: Climate;
  conditionBA: string;
  conditionCN: string;
  dataAtual: String;

  hoveredDate: NgbDate | null = null;

  fromDate: NgbDate;
  toDate: NgbDate | null;


  // DROPLET ICONS
  rainMarker = (L as any).ExtraMarkers.icon({
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

  fogMarker = (L as any).ExtraMarkers.icon({
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

  noLight = (L as any).ExtraMarkers.icon({
    shape: 'circle',
    markerColor: 'blue-dark',
    prefix: 'fa',
    icon: 'fa-moon-o',
    iconColor: '#fff',
    iconRotate: 0,
    extraClasses: '',
    number: '',
    svg: true
  });

  light = (L as any).ExtraMarkers.icon({
    shape: 'circle',
    markerColor: 'blue-dark',
    prefix: 'fa',
    icon: 'fa-lightbulb-o',
    iconColor: '#fff',
    iconRotate: 0,
    extraClasses: '',
    number: '',
    svg: true
  });

  outsideTemp = (L as any).ExtraMarkers.icon({
    shape: 'circle',
    markerColor: 'blue-dark',
    prefix: 'fa',
    icon: 'fa-thermometer-half',
    iconColor: '#fff',
    iconRotate: 0,
    extraClasses: '',
    number: '',
    svg: true
  });


  carbon = (L as any).ExtraMarkers.icon({
    shape: 'circle',
    markerColor: 'blue-dark',
    prefix: 'fa',
    icon: 'fa-leaf',
    iconColor: '#fff',
    iconRotate: 0,
    extraClasses: '',
    number: '',
    svg: true
  });

  clearAllFilters() {
    this.filterToSearch = '';
    if (this.dataSelection === 1) {
      this.getEventsByDate()
    } else {
      this.getEventsLast5Min()
    }
  }

  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
      this.selectDate();
    } else if (this.fromDate && !this.toDate && date && date.after(this.fromDate)) {
      this.toDate = date;
      this.selectDate();
    } else {
      this.fromDate = date;
      this.toDate = null;
    }
  }

  filterRain() {
    if (this.filterToSearch !== '&event_class=RA') {
      this.filterToSearch = '&event_class=RA'
    } else {
      this.filterToSearch = ''
    }
    this.onFilter()
  }

  filterFog() {
    if (this.filterToSearch !== '&event_class=FO') {
      this.filterToSearch = '&event_class=FO'
    } else {
      this.filterToSearch = ''
    }
    this.onFilter()
  }

  filterNoLight() {
    if (this.filterToSearch !== '&event_class=NL') {
      this.filterToSearch = '&event_class=NL'
    } else {
      this.filterToSearch = ''
    }
    this.onFilter()
  }

  filterLight() {
    if (this.filterToSearch !== '&event_class=LT') {
      this.filterToSearch = '&event_class=LT'
    } else {
      this.filterToSearch = ''
    }
    this.onFilter()
  }

  filterOutsideTemp() {
    if (this.filterToSearch !== '&event_class=OT') {
      this.filterToSearch = '&event_class=OT'
    } else {
      this.filterToSearch = ''
    }
    this.onFilter()
  }

  filterCarbon() {
    if (this.filterToSearch !== '&event_class=CF') {
      this.filterToSearch = '&event_class=CF'
    } else {
      this.filterToSearch = ''
    }
    this.onFilter()
  }

  onFilter() {
    for (let i = 0; i < this.mapMarkers.length; i++) {
      this.map.removeLayer(this.mapMarkers[i]);
    }
    this.mapMarkers = [];
    if (this.dataSelection === 0) {
      this.getEventsLast5Min();
    } else {
      this.getEventsByDate();
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

  constructor(private climateService: ClimateService, private eventService: EventService,
              private calendar: NgbCalendar, public formatter: NgbDateParserFormatter, private formBuilder: FormBuilder,
              private spinner: NgxSpinnerService) {
    this.fromDate = calendar.getToday();
    this.toDate = calendar.getNext(calendar.getToday(), 'd', 10);
  }

  private initMap(): void {
    this.map = L.map('mapConditions', {
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

  last5min() {
    for (let i = 0; i < this.mapMarkers.length; i++) {
      this.map.removeLayer(this.mapMarkers[i]);
    }
    this.mapMarkers = [];
    this.dataSelection = 0;
    this.getEventsLast5Min();
  }

  selectDate() {
    for (let i = 0; i < this.mapMarkers.length; i++) {
      this.map.removeLayer(this.mapMarkers[i]);
    }
    this.mapMarkers = [];
    this.dataSelection = 1;
    this.getEventsByDate();
  }

  getEventsByDate() {
    console.log(this.filterToSearch)
    this.eventService.getEventsBetweenDates(0, this.fromDate, this.toDate, '&event_type=CO' + this.filterToSearch, 100).subscribe(
      data => {
        data.results.forEach(r => {
          if (r.event_class === 'RA') {
            const marker = L.marker([r.latitude, r.longitude], {icon: this.rainMarker});
            marker.bindPopup('<div class="marker_car"><h6 style="text-align: center;">Timestamp</h6><p style="margin-top: 0px;text-align: center;">' + r.timestamp + '</p></div>' + '<div class="marker_car"><h6 style="text-align: center;">Type</h6><p style="margin-top: 0px;text-align: center;">"Rain Detected"</p></div>');
            marker.addTo(this.map);
            this.mapMarkers.push(marker);
          } else if (r.event_class === 'FO') {
            const marker = L.marker([r.latitude, r.longitude], {icon: this.fogMarker});
            marker.bindPopup('<div class="marker_car"><h6 style="text-align: center;">Timestamp</h6><p style="margin-top: 0px;text-align: center;">' + r.timestamp + '</p></div>' + '<div class="marker_car"><h6 style="text-align: center;">Type</h6><p style="margin-top: 0px;text-align: center;">"Fog Detected"</p></div>');
            marker.addTo(this.map);
            this.mapMarkers.push(marker);
            this.mapMarkers.push(marker);
          } else if (r.event_class === 'NL') {
            const marker = L.marker([r.latitude, r.longitude], {icon: this.noLight});
            marker.bindPopup('<div class="marker_car"><h6 style="text-align: center;">Timestamp</h6><p style="margin-top: 0px;text-align: center;">' + r.timestamp + '</p></div>' + '<div class="marker_car"><h6 style="text-align: center;">Type</h6><p style="margin-top: 0px;text-align: center;">"Medium Lights OFF"</p></div>');
            marker.addTo(this.map);
            this.mapMarkers.push(marker);
          } else if (r.event_class === 'LT') {
            const marker = L.marker([r.latitude, r.longitude], {icon: this.light});
            marker.bindPopup('<div class="marker_car"><h6 style="text-align: center;">Timestamp</h6><p style="margin-top: 0px;text-align: center;">' + r.timestamp + '</p></div>' + '<div class="marker_car"><h6 style="text-align: center;">Type</h6><p style="margin-top: 0px;text-align: center;">"Medium Lights ON"</p></div>');
            marker.addTo(this.map);
            this.mapMarkers.push(marker);
          } else if (r.event_class === 'OT') {
            const marker = L.marker([r.latitude, r.longitude], {icon: this.outsideTemp});
            marker.bindPopup('<div class="marker_car"><h6 style="text-align: center;">Timestamp</h6><p style="margin-top: 0px;text-align: center;">' + r.timestamp + '</p></div>' + '<div class="marker_car"><h6 style="text-align: center;">Type</h6><p style="margin-top: 0px;text-align: center;">"Outside Temperature"</p></div>');
            marker.addTo(this.map);
            this.mapMarkers.push(marker);
          } else if (r.event_class === 'CF') {
            const marker = L.marker([40.629779, -8.737498], {icon: this.carbon});
            marker.bindPopup('<div class="marker_car"><h6 style="text-align: center;">Timestamp</h6><p style="margin-top: 0px;text-align: center;">' + r.timestamp + '</p></div>' + '<div class="marker_car"><h6 style="text-align: center;">Type</h6><p style="margin-top: 0px;text-align: center;">"Carbon Emission"</p></div>');
            marker.addTo(this.map);
            this.mapMarkers.push(marker);
          }
        })
      }
    )
  }

  getEventsLast5Min() {
    this.eventService.getEventsLast5Mins('&event_type=CO' + this.filterToSearch).subscribe(
      data => {
        data.results.forEach(r => {
          if (r.event_class === 'RA') {
            const marker = L.marker([r.latitude, r.longitude], {icon: this.rainMarker});
            marker.bindPopup('<div class="marker_car"><h6 style="text-align: center;">Timestamp</h6><p style="margin-top: 0px;text-align: center;">' + r.timestamp + '</p></div>' + '<div class="marker_car"><h6 style="text-align: center;">Type</h6><p style="margin-top: 0px;text-align: center;">"Rain Detected"</p></div>');
            marker.addTo(this.map);
            this.mapMarkers.push(marker);
          } else if (r.event_class === 'FO') {
            const marker = L.marker([r.latitude, r.longitude], {icon: this.fogMarker});
            marker.bindPopup('<div class="marker_car"><h6 style="text-align: center;">Timestamp</h6><p style="margin-top: 0px;text-align: center;">' + r.timestamp + '</p></div>' + '<div class="marker_car"><h6 style="text-align: center;">Type</h6><p style="margin-top: 0px;text-align: center;">"Fog Detected"</p></div>');
            marker.addTo(this.map);
            this.mapMarkers.push(marker);
            this.mapMarkers.push(marker);
          } else if (r.event_class === 'NL') {
            const marker = L.marker([r.latitude, r.longitude], {icon: this.noLight});
            marker.bindPopup('<div class="marker_car"><h6 style="text-align: center;">Timestamp</h6><p style="margin-top: 0px;text-align: center;">' + r.timestamp + '</p></div>' + '<div class="marker_car"><h6 style="text-align: center;">Type</h6><p style="margin-top: 0px;text-align: center;">"Medium Lights OFF"</p></div>');
            marker.addTo(this.map);
            this.mapMarkers.push(marker);
          } else if (r.event_class === 'LT') {
            const marker = L.marker([r.latitude, r.longitude], {icon: this.light});
            marker.bindPopup('<div class="marker_car"><h6 style="text-align: center;">Timestamp</h6><p style="margin-top: 0px;text-align: center;">' + r.timestamp + '</p></div>' + '<div class="marker_car"><h6 style="text-align: center;">Type</h6><p style="margin-top: 0px;text-align: center;">"Medium Lights ON"</p></div>');
            marker.addTo(this.map);
            this.mapMarkers.push(marker);
          } else if (r.event_class === 'OT') {
            const marker = L.marker([r.latitude, r.longitude], {icon: this.outsideTemp});
            marker.bindPopup('<div class="marker_car"><h6 style="text-align: center;">Timestamp</h6><p style="margin-top: 0px;text-align: center;">' + r.timestamp + '</p></div>' + '<div class="marker_car"><h6 style="text-align: center;">Type</h6><p style="margin-top: 0px;text-align: center;">"Outside Temperature"</p></div>');
            marker.addTo(this.map);
            this.mapMarkers.push(marker);
          } else if (r.event_class === 'CF') {
            const marker = L.marker([40.629779, -8.737498], {icon: this.carbon});
            marker.bindPopup('<div class="marker_car"><h6 style="text-align: center;">Timestamp</h6><p style="margin-top: 0px;text-align: center;">' + r.timestamp + '</p></div>' + '<div class="marker_car"><h6 style="text-align: center;">Type</h6><p style="margin-top: 0px;text-align: center;">"Carbon Emission"</p></div>');
            marker.addTo(this.map);
            this.mapMarkers.push(marker);
          }
        })
        this.spinner.hide();
        this.starting = false;
      }
    )
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
      this.dataAtual = new Date().toLocaleTimeString();


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
  })

    if (this.dataSelection === 0) {
      this.getEventsLast5Min();
    }
  }

  ngOnInit(): void {
    this.spinner.show();
    this.radioGroupForm = this.formBuilder.group({});

    this.subscription = timer(0, 10000).subscribe(() => {
      // para a parte das conditions
      this.getConditions()
    });

    this.canvas = document.getElementById('chartBarra');
    this.ctx = this.canvas.getContext('2d');
    this.chartEmail = new Chart(this.ctx, {
      type: 'pie',
      data: {
        labels: [1, 2, 3],
        datasets: [{
          label: 'Emails',
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

    this.canvas = document.getElementById('chartCostaNova');
    this.ctx = this.canvas.getContext('2d');
    this.chartEmail = new Chart(this.ctx, {
      type: 'pie',
      data: {
        labels: [1, 2, 3],
        datasets: [{
          label: 'Emails',
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

  ngAfterViewInit(): void {
    this.initMap();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
