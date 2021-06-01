import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {environment} from '../../../environments/environment';

const httpOptions = {
  headers: new HttpHeaders({'Content-type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class DailyInflowService {
  private baseURL = environment.baseURL + 'daily-inflow/'
  constructor(private http: HttpClient) { }

  getTodayDailyInflowBarra(): Observable<any> {
    return this.http.get<any>(this.baseURL + '?location=BA&limit=1', httpOptions);
  }

  getTodayDailyInflowCosta(): Observable<any> {
    return this.http.get<any>(this.baseURL + '?location=CN&limit=1', httpOptions);
  }

}
