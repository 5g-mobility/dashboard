import {Component, OnDestroy, OnInit} from '@angular/core';
import Chart from 'chart.js';
import {NgbDate, NgbCalendar, NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';
import {faWalking, faBiking, faDog, faExclamationTriangle, faClock, faCarSide, faTachometerAlt, faCheck, faCar, faQuestion} from '@fortawesome/free-solid-svg-icons';
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
  selectedLocation = 'PT';
  selectedDate = 0;
  animalsBikeLanes: Number;
  peopleBikeLanes: Number;
  bikesBikeLanes: Number;
  dataBikeLanesUpdate: String;
  lastRoadDanger: Event;

  hoveredDate: NgbDate | null = null;
  fromDate: NgbDate | null = null;
  toDate: NgbDate | null = null;


  constructor(private miscellaneousService: MiscellaneousService, private calendar: NgbCalendar,
              public formatter: NgbDateParserFormatter, private spinner: NgxSpinnerService,
              private eventService: EventService) {
    this.fromDate = this.calendar.getToday();
    this.toDate = this.calendar.getNext(this.calendar.getToday(), 'd', 10);
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

  updateInfo() {
    this.getBikeLanesInfo();
    this.getLastRoadDanger();
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
      this.lastRoadDanger !== undefined) {
      this.spinner.hide();
    }
  }

  ngOnInit(): void {
    this.spinner.show();
    this.subscription = timer(0, 30000).subscribe(() => {
      this.updateInfo();
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
