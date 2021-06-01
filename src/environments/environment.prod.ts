import { HttpHeaders } from '@angular/common/http';
export const environment = {
  httpOptions: {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  },
  baseURL: 'http://10.0.13.36:8000/5g-mobility/',
  production: true
};
