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

  getClimate(field?: string, search?: string): Observable<any> {
    let url = this.baseURL;
    if (field != null && search != null) {
      url += '/?' + field + '=' + search;
    } else {
      url = this.baseURL;
    }
    return this.http.get<any>(url, httpOptions);
  }
}
