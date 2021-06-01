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
export class ClimateService {
  private baseURL = environment.baseURL + 'climate/'
  constructor(private http: HttpClient) { }

  getBarraClimate(): Observable<any> {
    return this.http.get<any>(this.baseURL + '?location=BA&limit=1', httpOptions);
  }

  getCostaNovaClimate(): Observable<any> {
    return this.http.get<any>(this.baseURL + '?location=CN&limit=1', httpOptions);
  }
}
