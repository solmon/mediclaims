

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class ClaimService {

  dummyData:Object ={"st jhons":["blood test","x ray"],"ms ramaiya":["urin test","dna test"],"manipal":["x ray","mri scan"]};
  constructor(private http: HttpClient) {

  }

  claimList(searchdata: any): Observable<any> {
    return this.http.post<any>('http://localhost:3000/api/hospital/find-enrollment', searchdata,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      })
      .pipe(map(response => response || []));
  }

  benefitDetails(searchdata: any): Observable<any> {
    return this.http.post<any>('http://localhost:3000/api/hospital/find-benefit', searchdata,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      })
      .pipe(map(response => response || []));
  }

  fileCLaim(data: any): Observable<any> {
    return this.http.post<any>('http://localhost:3000/api/hospital/create-claim', data,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      })
      .pipe(map(response => response || []));
  }
  provider():any[]{
    return ["st jhons","ms ramaiya","manipal"]
  }
  procedure(data: any):any[]{
    return this.dummyData[data];
  }
}
