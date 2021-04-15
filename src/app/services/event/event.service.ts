import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
}

@Injectable({
  providedIn: 'root'
})

export class EventService {
  private baseURL = 'localhost:8000/5g-mobility/event/'
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

}
