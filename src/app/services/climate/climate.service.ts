import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({'Content-type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class ClimateService {
  private baseURL = 'http://localhost:8000/5g-mobility/climate/'
  constructor(private http: HttpClient) { }

  getClimate(): Observable<any> {
    return this.http.get<any>(this.baseURL, httpOptions);
  }
}
