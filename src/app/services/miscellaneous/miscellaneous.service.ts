import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/internal/Observable';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ConditionsStats} from '../../models/conditions-stats';
import {CarbonFootprint} from '../../models/carbon-footprint';
import {NgbDate} from '@ng-bootstrap/ng-bootstrap';

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
    return this.http.get<ConditionsStats>(this.baseURL + 'conditions_stats/' + '?location=' + location, httpOptions)
  }

  getCarbonFootprint(location: String): Observable<CarbonFootprint> {
    return this.http.get<CarbonFootprint>(this.baseURL + 'carbon_footprint/' + '?location=' + location, httpOptions)
  }

  getDailyExcessiveSpeed(): Observable<any> {
    return this.http.get<any>(this.baseURL + 'daily_excessive_speed', httpOptions)
  }

  getCarsChartInfo(location: string, from?: NgbDate, to?: NgbDate): Observable<any> {
    let to_str;
    let last_24h_str;
    let from_str;

    if (from !== null) {
      from_str = from.year + '-' + from.month.toLocaleString('en-US', {
        minimumIntegerDigits: 2,
        useGrouping: false
      }) + '-' + from.day.toLocaleString('en-US', {
        minimumIntegerDigits: 2,
        useGrouping: false
      }) + 'T00:00'
    } else {
      last_24h_str = new Date(new Date().getTime() - (24 * 60 * 60 * 1000)).toISOString().slice(0, -1);
    }

    if (to !== null) {
      to_str = to.year + '-' + to.month.toLocaleString('en-US', {
        minimumIntegerDigits: 2,
        useGrouping: false
      }) + '-' + to.day.toLocaleString('en-US', {
        minimumIntegerDigits: 2,
        useGrouping: false
      }) + 'T00:00'
    }

    return this.http.get<any>(this.baseURL + 'circulation_vehicles?location=' + location + '&timestamp__gte=' +
      (from_str === null || from_str === undefined ? last_24h_str : from_str) + (to_str === null || to_str === undefined ?
        '' : '&timestamp__lte=' + to_str), httpOptions)
  }

  getTopSpeedSummary() {
    return this.http.get<any>(this.baseURL + 'top_speed_road_traffic_summary', httpOptions);
  }

  getMaxTrafficInflowSummary() {
    return this.http.get<any>(this.baseURL + 'max_daily_inflow_summary', httpOptions);
  }

  getCurrentTrafficIndo() {
    return this.http.get<any>(this.baseURL + 'current_traffic_stats', httpOptions);
  }

  getRandomEventsOverview() {
    return this.http.get<any>(this.baseURL + 'random_events_overview', httpOptions);
  }

  getBikeLanesInfo(location: string, from?: NgbDate, to?: NgbDate): Observable<any> {
    let to_str;
    let last_24h_str;
    let from_str;

    if (from !== null) {
      from_str = from.year + '-' + from.month.toLocaleString('en-US', {
        minimumIntegerDigits: 2,
        useGrouping: false
      }) + '-' + from.day.toLocaleString('en-US', {
        minimumIntegerDigits: 2,
        useGrouping: false
      }) + 'T00:00'
    } else {
      last_24h_str = new Date(new Date().getTime() - (24 * 60 * 60 * 1000)).toISOString().slice(0, -1);
    }

    if (to !== null) {
      to_str = to.year + '-' + to.month.toLocaleString('en-US', {
        minimumIntegerDigits: 2,
        useGrouping: false
      }) + '-' + to.day.toLocaleString('en-US', {
        minimumIntegerDigits: 2,
        useGrouping: false
      }) + 'T00:00'
    }

    return this.http.get<any>(this.baseURL + 'bike_lanes_stats?location=' + location + '&timestamp__gte=' +
      (from_str === null || from_str === undefined ? last_24h_str : from_str) + (to_str === null || to_str === undefined ?
        '' : '&timestamp__lte=' + to_str), httpOptions)
  }

}
