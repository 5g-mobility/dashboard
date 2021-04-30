import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {NgbDate} from '@ng-bootstrap/ng-bootstrap';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
}

@Injectable({
  providedIn: 'root'
})

export class EventService {
  private baseURL = 'http://localhost:8000/5g-mobility/event/'
  constructor( private http: HttpClient ) {
  }

  getEvent(field?: string, search?: string): Observable<any> {
    let url = this.baseURL;
    if (field != null && search != null) {
      url += '/?' + field + '=' + search;
    } else {
      url = this.baseURL;
    }
    return this.http.get<any>(url, httpOptions);
  }

  getEventBetweenDates(from: string, to: string): Observable<any> {
    let url = this.baseURL + '?timestamp__lte=' + to + '&timestamp__gte=' + from
    return this.http.get<any>(url, httpOptions)
  }

  getRoadTrafficEvents(classe: string, from?: string, to?: string): Observable<any> {
    let url = this.baseURL
    if (from != null || to != null ){
      url = this.baseURL + '?event_type=RT&timestamp__lte=' + to + '&timestamp__gte=' + from
    } else {
      url = this.baseURL + '?event_type=RT&event_class=' + classe
    }
    return this.http.get<any>(url, httpOptions)
  }

}
