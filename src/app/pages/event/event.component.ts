import { Component, OnInit } from '@angular/core';
import {ClimateService} from "../../services/climate/climate.service";
import {EventService} from "../../services/event/event.service";
import {NgbCalendar, NgbDate, NgbDateParserFormatter} from "@ng-bootstrap/ng-bootstrap";
import {FormBuilder, FormGroup} from "@angular/forms";
import {timer} from "rxjs";

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss']
})
export class EventComponent implements OnInit {
  selectionMap = 0;
  fromDate: NgbDate | null;
  toDate: NgbDate | null;
  hoveredDate: NgbDate | null = null;
  events: Event[] = [];
  filter: string;
  selectingdate = 0
  public radioGroupForm: FormGroup;

  constructor(private climateService: ClimateService, private eventService: EventService,
              private calendar: NgbCalendar, public formatter: NgbDateParserFormatter, private formBuilder: FormBuilder) {
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
  }

  filterCN() {
    if (this.filter !== '&location=CN') {
      this.filter = '&location=CN'
    } else {
      this.filter = null
    }
  }

  filterBarra() {
    if (this.filter !== '&location=BA') {
      this.filter = '&location=BA'
    } else {
      this.filter = null
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
    timer(0, 10000).subscribe( () => {
      if ((this.toDate != null && this.fromDate != null) || this.filter != null) {
        this.events = []
        this.eventService.getEventsBetweenDates(this.fromDate, this.toDate, this.filter).subscribe(
          data => data.results.forEach( d => {this.events.push(d)}));
      } else {
        this.eventService.getAllEvents().subscribe(data => data.results.forEach( d => {this.events.push(d)}));
      }
    })

  }

}
