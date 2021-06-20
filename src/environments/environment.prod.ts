import { HttpHeaders } from '@angular/common/http';
export const environment = {
  httpOptions: {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  },
  baseURL: 'http://localhost:8000/5g-mobility/',
  production: true
};
