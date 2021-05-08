import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/internal/Observable';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {NgbDate} from '@ng-bootstrap/ng-bootstrap';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
}

@Injectable({
  providedIn: 'root'
})

export class EventService {
  private baseURL = 'http://localhost:8000/5g-mobility/event/'

  constructor(private http: HttpClient) {
  }

  getAllEvents(): Observable<any> {
    return this.http.get<any>(this.baseURL, httpOptions)
  }

  getEventsBetweenDates(from: NgbDate, to: NgbDate, filter?: string): Observable<any> {
    const from_str = from.year + '-' + from.month.toLocaleString('en-US', {
      minimumIntegerDigits: 2,
      useGrouping: false
    }) + '-' + from.day.toLocaleString('en-US', {
      minimumIntegerDigits: 2,
      useGrouping: false
    }) + 'T00:00'

    const to_str = to.year + '-' + to.month.toLocaleString('en-US', {
      minimumIntegerDigits: 2,
      useGrouping: false
    }) + '-' + to.day.toLocaleString('en-US', {
      minimumIntegerDigits: 2,
      useGrouping: false
    }) + 'T00:00'
    if (filter == null) {
      return this.http.get<any>(this.baseURL + '?timestamp__gte=' + from_str + '&timestamp__lte=' + to_str, httpOptions)
    }
    return this.http.get<any>(this.baseURL + '?timestamp__gte=' + from_str + '&timestamp__lte=' + to_str + filter, httpOptions)
  }

  getEventsLast5Mins(): Observable<any> {
    const date = new Date();
    date.setMinutes(date.getMinutes() - 5);
    // ex: 2021-04-25T16:33:04.446000
    const last5 = date.getFullYear() + '-' + date.getMonth().toLocaleString('en-US', {
      minimumIntegerDigits: 2,
      useGrouping: false
    }) + '-' + date.getDay().toLocaleString('en-US', {
      minimumIntegerDigits: 2,
      useGrouping: false
    }) + 'T' + date.getHours().toLocaleString('en-US', {
      minimumIntegerDigits: 2,
      useGrouping: false
    }) + ':' + date.getMinutes().toLocaleString('en-US', {
      minimumIntegerDigits: 2,
      useGrouping: false
    }) + ':' + date.getSeconds().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping: false})
    console.log(last5)
    return this.http.get<any>(this.baseURL + '?timestamp__lte=' + last5 + '&event_type=CO' , httpOptions)
  }

  getExcessiveSpeedLast5Mins(): Observable<any> {
    const date = new Date();
    date.setMinutes(date.getMinutes() - 5);
    // ex: 2021-04-25T16:33:04.446000
    const last5 = date.getFullYear() + '-' + date.getMonth().toLocaleString('en-US', {
      minimumIntegerDigits: 2,
      useGrouping: false
    }) + '-' + date.getDay().toLocaleString('en-US', {
      minimumIntegerDigits: 2,
      useGrouping: false
    }) + 'T' + date.getHours().toLocaleString('en-US', {
      minimumIntegerDigits: 2,
      useGrouping: false
    }) + ':' + date.getMinutes().toLocaleString('en-US', {
      minimumIntegerDigits: 2,
      useGrouping: false
    }) + ':' + date.getSeconds().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping: false})
    console.log(last5)
    return this.http.get<any>(this.baseURL + '?timestamp__lte=' + last5 + '&event_type=CO&event_class=CS' , httpOptions )
  }

  getExcessiveSpeedBetweenDates(from: NgbDate, to: NgbDate): Observable<any> {
    const from_str = from.year + '-' + from.month.toLocaleString('en-US', {
      minimumIntegerDigits: 2,
      useGrouping: false
    }) + '-' + from.day.toLocaleString('en-US', {
      minimumIntegerDigits: 2,
      useGrouping: false
    }) + 'T00:00'

    const to_str = to.year + '-' + to.month.toLocaleString('en-US', {
      minimumIntegerDigits: 2,
      useGrouping: false
    }) + '-' + to.day.toLocaleString('en-US', {
      minimumIntegerDigits: 2,
      useGrouping: false
    }) + 'T00:00'
    console.log(from_str, to_str)
    return this.http.get<any>(this.baseURL + '?timestamp__gte=' + from_str + '&timestamp__lte=' + to_str + '&event_type=CO&event_class=CS', httpOptions)
  }
}
