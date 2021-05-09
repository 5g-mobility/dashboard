import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/internal/Observable';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ConditionsStats} from '../../models/conditions-stats';
import {CarbonFootprint} from '../../models/carbon-footprint';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
}

@Injectable({
  providedIn: 'root'
})

export class MiscellaneousService {
  private baseURL = 'http://localhost:8000/5g-mobility/'

  constructor(private http: HttpClient) {
  }

  getConditionsChartStats(location: String): Observable<ConditionsStats> {
    return this.http.get<ConditionsStats>(this.baseURL + 'conditions_stats/' +  '?location=' + location, httpOptions)
  }

  getCarbonFootprint(location: String): Observable<CarbonFootprint> {
    return this.http.get<CarbonFootprint>(this.baseURL + 'carbon_footprint/' +  '?location=' + location, httpOptions)
  }

  getDailyExcessiveSpeed(): Observable<any> {
    return this.http.get<any>(this.baseURL + 'daily_excessive_speed', httpOptions)
  }

}
