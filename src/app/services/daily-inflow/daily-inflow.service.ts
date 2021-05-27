import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {DailyInflow} from '../../models/daily-inflow';

const httpOptions = {
  headers: new HttpHeaders({'Content-type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class DailyInflowService {
  private baseURL = 'http://localhost:8000/5g-mobility/daily-inflow/'
  constructor(private http: HttpClient) { }

  getTodayDailyInflowBarra(): Observable<any> {
    return this.http.get<any>(this.baseURL + '?location=BA&limit=1', httpOptions);
  }

  getTodayDailyInflowCosta(): Observable<any> {
    return this.http.get<any>(this.baseURL + '?location=CN&limit=1', httpOptions);
  }

}
