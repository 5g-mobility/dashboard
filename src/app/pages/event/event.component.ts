import {Component, OnDestroy, OnInit} from '@angular/core';
import {ClimateService} from '../../services/climate/climate.service';
import {EventService} from '../../services/event/event.service';
import {NgbCalendar, NgbDate, NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, FormGroup} from '@angular/forms';
import {timer} from 'rxjs';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss']
})
export class EventComponent implements OnInit, OnDestroy {
  selectionMap = 0 ;
  fromDate: NgbDate | null;
  toDate: NgbDate | null;
  hoveredDate: NgbDate | null = null;
  events: Event[] = [];
  filter: string;
  page: number = Number(1);
  totalEvents: number;
  private subscription;
  filterType: String = '';
  filterClass: String = '';
  selectingDate = -1;
  public radioGroupForm: FormGroup;

  constructor(private climateService: ClimateService, private eventService: EventService,
              private calendar: NgbCalendar, public formatter: NgbDateParserFormatter, private formBuilder: FormBuilder,
              private spinner: NgxSpinnerService) {
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
    this.getEvents()
  }

  clearAllFilters() {
    this.toDate = null;
    this.fromDate = null;
    this.filter = null;
    this.selectingDate = -1;
    this.filterType = '';
    this.getEvents();
    timer(50).subscribe(data=> {
      this.selectionMap = 0;
    })
  }

  // FILTER BY CLASS! !!!!!!!!!!!!!
  filterCN() {
    if (this.filter !== '&location=CN') {
      this.filter = '&location=CN'
    } else {
      this.filter = null
    }
    this.getEvents()
  }

  filterBarra() {
    if (this.filter !== '&location=BA') {
      this.filter = '&location=BA'
    } else {
      this.filter = null
    }
    this.getEvents()
  }

    filterRain() {
    if (this.filterType !== '&event_class=RA') {
      this.filterType = '&event_class=RA'
    } else {
      this.filterType = ''
    }
    this.getEvents()
  }

  filterFog() {
    if (this.filterType !== '&event_class=FO') {
      this.filterType = '&event_class=FO'
    } else {
      this.filterType = ''
    }
    this.getEvents()
  }

  filterNoLight() {
    if (this.filterType !== '&event_class=NL') {
      this.filterType = '&event_class=NL'
    } else {
      this.filterType = ''
    }
    this.getEvents()
  }

  filterLight() {
    if (this.filterType !== '&event_class=LT') {
      this.filterType = '&event_class=LT'
    } else {
      this.filterType = ''
    }
  }

  filterOutsideTemp() {
    if (this.filterType !== '&event_class=OT') {
      this.filterType = '&event_class=OT'
    } else {
      this.filterType = ''
    }
    this.getEvents()
  }

  filterAnimal() {
    if (this.filterType !== '&event_class=AN') {
      this.filterType = '&event_class=AN'
    } else {
      this.filterType = ''
    }
    this.getEvents()
  }

  filterPerson() {
    if (this.filterType !== '&event_class=PE') {
      this.filterType = '&event_class=PE'
    } else {
      this.filterType = ''
    }
    this.getEvents()
  }

  filterStrangeObject() {
    if (this.filterType !== '&event_class=SO') {
      this.filterType = '&event_class=SO'
    } else {
      this.filterType = ''
    }
    this.getEvents()
  }

  filterStoppedCar() {
    if (this.filterType !== '&event_class=SC') {
      this.filterType = '&event_class=SC'
    } else {
      this.filterType = ''
    }
    this.getEvents()
  }

  filterCar() {
    if (this.filterType !== '&event_class=CA') {
      this.filterType = '&event_class=CA'
    } else {
      this.filterType = ''
    }
    this.getEvents()
  }

  filterBicycle() {
    if (this.filterType !== '&event_class=BC') {
      this.filterType = '&event_class=BC'
    } else {
      this.filterType = ''
    }
    this.getEvents()
  }

  filterMotorcycle() {
    if (this.filterType !== '&event_class=MC') {
      this.filterType = '&event_class=MC'
    } else {
      this.filterType = ''
    }
    this.getEvents()
  }

  filterTruck() {
    if (this.filterType !== '&event_class=TR') {
      this.filterType = '&event_class=TR'
    } else {
      this.filterType = ''
    }
    this.getEvents()
  }

  filterCarSpeeding() {
    if (this.filterType !== '&event_class=CS') {
      this.filterType = '&event_class=CS'
    } else {
      this.filterType = ''
    }
    this.getEvents()
  }

  filterCarbon() {
    if (this.filterType !== '&event_class=CF') {
      this.filterType = '&event_class=CF'
    } else {
      this.filterType = ''
    }
    this.getEvents()
  }

  // FILTER BY TYPE !!!
  filterRoadTraffic() {
    if (this.filterClass !== '&event_type=CF') {
      this.filterClass = '&event_type=CF'
    } else {
      this.filterClass = ''
    }
    this.getEvents()
  }

  filterRoadDanger() {
    if (this.filterClass !== '&event_type=RD') {
      this.filterClass = '&event_type=RD'
    } else {
      this.filterClass = ''
    }
    this.getEvents()
  }

  filterBikeLanes() {
    if (this.filterClass !== '&event_type=BL') {
      this.filterClass = '&event_type=BL'
    } else {
      this.filterClass = ''
    }
    this.getEvents()
  }

  filterConditions() {
    if (this.filterClass !== '&event_type=CO') {
      this.filterClass = '&event_type=CO'
    } else {
      this.filterClass = ''
    }
    this.getEvents()
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

  changePage(page: number) {
    this.page = page;
    this.getEvents();
  }

  getEvents() {
    if ((this.toDate != null && this.fromDate != null) || this.filter != null || this.filterType !== '') {
      this.eventService.getEventsBetweenDates((this.page - 1) * 10, this.fromDate, this.toDate, this.filterType + '' + this.filterClass + (this.filter === null || this.filter === undefined ? '' : this.filter)).subscribe(
        data => {
          this.events = [];
          this.totalEvents = data.count;
          data.results.forEach(d => {
            this.events.push(d)
          });
          this.spinner.hide();
        });
    } else {
      this.eventService.getAllEvents((this.page - 1) * 10).subscribe(data => {
        this.events = [];
        this.totalEvents = data.count;
        data.results.forEach(d => {
          this.events.push(d)
        });
        this.spinner.hide();
      });
    }
  }

  ngOnInit(): void {
    this.spinner.show()
     this.subscription = timer(0, 10000).subscribe(() => {
      this.getEvents();
    })
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
