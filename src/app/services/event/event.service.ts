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

  getAllEvents(offset: number): Observable<any> {
    return this.http.get<any>(this.baseURL + '?offset=' + offset, httpOptions)
  }

  getEventsBetweenDates(offset: number, from?: NgbDate, to?: NgbDate, filter?: string, limit?: number): Observable<any> {
    // ATENÇÃO:
    // PARA UNS CASOS É PRECISO VERIFICAR POR NULL, PARA OUTROS POR UNIDENTIFIED, NÃO ALTERAR
    if (from != null && to != null)  {
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
        return this.http.get<any>(this.baseURL + (from_str === undefined ? '' : '?timestamp__gte=' + from_str) + (to_str === undefined ? '' : '&timestamp__lte=' + to_str)  + '&offset=' + offset +
        (limit === null || limit === undefined ? '' : '&limit=' + limit), httpOptions)
      }
      return this.http.get<any>(this.baseURL + (from_str === undefined ? '' : '?timestamp__gte=' + from_str) + (to_str === undefined ? '' : '&timestamp__lte=' + to_str)  +  '&offset=' + offset
        + (limit === null || limit === undefined ? '' : '&limit=' + limit) + (filter === null || filter === undefined ? '' : '' + filter) , httpOptions)
    }
    return this.http.get<any>(this.baseURL + '?offset=' + offset + (limit === null || limit === undefined ? '' : '&limit=' + limit) + (filter === null || filter === undefined ? '' : '' + filter) , httpOptions )
  }

  getEventsLast5Mins(filter?: string): Observable<any> {
    console.log(filter)
    const date = new Date();
    date.setMinutes(date.getMinutes() - 5);

    if (filter == null) {
      return this.http.get<any>(this.baseURL + '?timestamp__gte=' + date.toISOString(), httpOptions)
    }
    return this.http.get<any>(this.baseURL + '?timestamp__gte=' + date.toISOString()  + filter, httpOptions)
  }

  getExcessiveSpeedLast5Mins(): Observable<any> {
    const date: Date = new Date();
    date.setMinutes(date.getMinutes() - 5);
    return this.http.get<any>(this.baseURL + '?timestamp__gte=' + date.toISOString() + '&event_type=CO&event_class=CS' , httpOptions )
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
    return this.http.get<any>(this.baseURL + '?timestamp__gte=' + from_str + '&timestamp__lte=' + to_str + '&event_type=CO&event_class=CS', httpOptions)
  }
}
