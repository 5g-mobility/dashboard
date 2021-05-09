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
  selectionMap = -1 ;
  fromDate: NgbDate | null;
  toDate: NgbDate | null;
  hoveredDate: NgbDate | null = null;
  events: Event[] = [];
  filter: string;
  page: number = Number(1);
  totalEvents: number;
  private subscription;
  filterToSearch: String = '';
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
    this.selectionMap = -1;
    this.selectingDate = -1;
    this.filterToSearch = ''
    this.getEvents()
  }

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
    if (this.filterToSearch !== '&event_class=RA') {
      this.filterToSearch = '&event_class=RA'
    } else {
      this.filterToSearch = ''
    }
    this.getEvents()
  }

  filterFog() {
    if (this.filterToSearch !== '&event_class=FO') {
      this.filterToSearch = '&event_class=FO'
    } else {
      this.filterToSearch = ''
    }
    this.getEvents()
  }

  filterNoLight() {
    if (this.filterToSearch !== '&event_class=NL') {
      this.filterToSearch = '&event_class=NL'
    } else {
      this.filterToSearch = ''
    }
    this.getEvents()
  }

  filterLight() {
    if (this.filterToSearch !== '&event_class=LT') {
      this.filterToSearch = '&event_class=LT'
    } else {
      this.filterToSearch = ''
    }
  }

  filterOutsideTemp() {
    if (this.filterToSearch !== '&event_class=OT') {
      this.filterToSearch = '&event_class=OT'
    } else {
      this.filterToSearch = ''
    }
    this.getEvents()
  }

  filterCarbon() {
    if (this.filterToSearch !== '&event_class=CF') {
      this.filterToSearch = '&event_class=CF'
    } else {
      this.filterToSearch = ''
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
    if ((this.toDate != null && this.fromDate != null) || this.filter != null || this.filterToSearch !== '') {
      this.eventService.getEventsBetweenDates((this.page - 1) * 10, this.fromDate, this.toDate, this.filterToSearch + (this.filter === null || this.filter === undefined ? '' : this.filter)).subscribe(
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
