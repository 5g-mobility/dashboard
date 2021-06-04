import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/internal/Observable';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {NgbDate} from '@ng-bootstrap/ng-bootstrap';
import {environment} from '../../../environments/environment';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
}

@Injectable({
  providedIn: 'root'
})

export class EventService {
  private baseURL = environment.baseURL + 'event/'

  constructor(private http: HttpClient) {
  }

  getAllEvents(offset: number): Observable<any> {
    return this.http.get<any>(this.baseURL + '?offset=' + offset, httpOptions)
  }

  getEventsBetweenDates(offset: number, from?: NgbDate, to?: NgbDate, filter?: string, limit?: number): Observable<any> {
    if (from != null && to != null) {
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

      if (filter === null || filter === undefined) {
        return this.http.get<any>(this.baseURL + (from_str === undefined ? '' : '?timestamp__gte=' + from_str)
          + (to_str === undefined ? '' : '&timestamp__lte=' + to_str) + '&offset=' + offset +
          (limit === null || limit === undefined ? '' : '&limit=' + limit), httpOptions)
      }
      return this.http.get<any>(this.baseURL + (from_str === undefined ? '' : '?timestamp__gte=' + from_str)
        + (to_str === undefined ? '' : '&timestamp__lte=' + to_str) + '&offset=' + offset
        + (limit === null || limit === undefined ? '' : '&limit=' + limit) + (filter === null || filter === undefined ? '' : '' + filter)
        , httpOptions)
    }
    return this.http.get<any>(this.baseURL + '?offset=' + offset + (limit === null || limit === undefined ? '' : '&limit=' + limit)
      + (filter === null || filter === undefined ? '' : '' + filter), httpOptions)
  }

  getEventsLast5Mins(offset: number, filter?: string, limit?: number): Observable<any> {
    const date = new Date();
    date.setMinutes(date.getMinutes() - 5);

    if (filter == null) {
      return this.http.get<any>(this.baseURL + '?timestamp__gte=' + date.toISOString() + '&offset=' + offset
        + (limit === null || limit === undefined ? '' : '&limit=' + limit), httpOptions)
    }
    return this.http.get<any>(this.baseURL + '?timestamp__gte=' + date.toISOString() + '&offset=' + offset
      + filter + (limit === null || limit === undefined ? '' : '&limit=' + limit), httpOptions)
  }

  getLastRoadDanger(location: string, from?: NgbDate, to?: NgbDate): Observable<any> {
    let to_str;
    let from_str;
    let last_24h_str;

    if (from !== null) {
      from_str = from.year + '-' + from.month.toLocaleString('en-US', {
        minimumIntegerDigits: 2,
        useGrouping: false
      }) + '-' + from.day.toLocaleString('en-US', {
        minimumIntegerDigits: 2,
        useGrouping: false
      }) + 'T00:00'
    } else {
      last_24h_str = new Date(new Date().getTime() - (24 * 60 * 60 * 1000)).toISOString().slice(0, -1);
    }

    if (to !== null) {
      to_str = to.year + '-' + to.month.toLocaleString('en-US', {
        minimumIntegerDigits: 2,
        useGrouping: false
      }) + '-' + to.day.toLocaleString('en-US', {
        minimumIntegerDigits: 2,
        useGrouping: false
      }) + 'T00:00'
    }

    return this.http.get<any>(this.baseURL + '?location=' + location +
      '&limit=1' + '&event_type=RD' + '&timestamp__gte=' +  (from_str === null || from_str === undefined ? last_24h_str : from_str) +
      (to_str === null || to_str === undefined ?
        '' : '&timestamp__lte=' + to_str), httpOptions)
  }

  getExcessiveSpeedLast5Mins(limit?: number): Observable<any> {
    const date: Date = new Date();
    date.setMinutes(date.getMinutes() - 5);
    return this.http.get<any>(this.baseURL + '?timestamp__gte=' + date.toISOString() + '&event_type=CO&event_class=CS'
      + (limit === null || limit === undefined ? '' : '&limit=' + limit), httpOptions)
  }

  getExcessiveSpeedBetweenDates(from: NgbDate, to: NgbDate, limit?: number): Observable<any> {
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
    return this.http.get<any>(this.baseURL + '?timestamp__gte=' + from_str + '&timestamp__lte=' + to_str +
      '&event_type=CO&event_class=CS' + (limit === null || limit === undefined ? '' : '&limit=' + limit), httpOptions)
  }
}
