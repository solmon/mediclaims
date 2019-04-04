

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class InsuranceService {

  constructor(private http: HttpClient) {

  }

  contractList(): Observable<any> {
    return this.http.post<any>('http://localhost:3000/api/hospital/claims',
    {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    })
    .pipe(map(response => response || []));
  }
  processCLaim(data: any): Observable<any> {
    return this.http.post<any>('http://localhost:3000/api/insurance/update-claim', data,
    {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    })
    .pipe(map(response => response || []));
  }
}
