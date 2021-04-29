import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({'Content-type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class DailyInflowService {
  private baseURL = 'http://localhost:8000/5g-mobility/daily-inflow/'
  constructor(private http: HttpClient) { }

  getDaily(field?: string, search?: string): Observable<any> {
    let url = this.baseURL;
    if (field != null && search != null) {
      url += '/?' + field + '=' + search;
    } else {
      url = this.baseURL;
    }
    return this.http.get<any>(url, httpOptions);
  }

  getTrafficBA_betweenDates(from: string, to: string): Observable<any> {
    // EXEMPLO CURL:
    // "http://localhost:8000/5g-mobility/daily-inflow/?date__lte=2021-04-20&date__gte=2021-04-10"
    let url = this.baseURL + '?date__lte=' + to + '&date__gte=' + from
    return this.http.get<any>(url, httpOptions)
  }
}
