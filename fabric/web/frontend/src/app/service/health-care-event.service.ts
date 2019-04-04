import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class HealthCareEventService {

  dummyData: Object = { "st jhons": ["blood test", "x ray"], "ms ramaiya": ["urin test", "dna test"], "manipal": ["x ray", "mri scan"] };

  constructor(private http: HttpClient) { }


  getDetails(searchData): Observable<any> {
    return this.http.post<any>('http://localhost:3000/api/hospital/find-patient-ssn', searchData,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        }),
        observe: 'response'
      })
      .pipe(map(response => response || []));
  }

  addService(data:any):Observable<any>{
    return this.http.post<any>('http://localhost:3000/api/hospital/add-service',data,
    {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      observe: 'response'
    })
    .pipe(map(response => response || []));
    
  }

  provider(): Observable<any> {
    return this.http.post<any>('http://localhost:3000/api/hospital/get-providers',
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        }),
        observe: 'response'
      })
      .pipe(map(response => response || []));
  }


  addPhysician(data: any): Observable<any> {
    return this.http.post<any>('http://localhost:3000/api/hospital/create-physician', data,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        }),
        observe: 'response'
      })
      .pipe(map(response => response || []));
  }

  gethceList(): Observable<any> {
    return this.http.post<any>('http://localhost:3000/api/hospital/claims',
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        }),
        observe: 'response'
      })
      .pipe(map(response => response || []));
  }

  getProcedureList(data): Observable<any> {
    return this.http.post<any>('http://localhost:3000/api/hospital/get-procedures', data,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        }),
        observe: 'response'
      })
      .pipe(map(response => response || []));
  }


  getPhysicianList(): Observable<any> {
    return this.http.post<any>('http://localhost:3000/api/hospital/get-physicians',
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        }),
        observe: 'response'
      })
      .pipe(map(response => response || []));

  }

  updateProcedure(data: any): Observable<any> {
    return this.http.post<any>('http://localhost:3000/api/hospital/update-procedure', data,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        }),
        observe: 'response'
      })
      .pipe(map(response => response || []));
  }

  getEnrollment(data): Observable<any> {
    return this.http.post<any>('http://localhost:3000/api/hospital/find-enrollment', data,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        }),
        observe: 'response'
      })
      .pipe(map(response => response || []));
  }

  createHce(data): Observable<any> {
    return this.http.post<any>('http://localhost:3000/api/hospital/create-claim', data,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        }),
        observe: 'response'
      })
      .pipe(map(response => response || []));
  }

  getBenefitList(): Observable<any> {
    return this.http.post<any>('http://localhost:3000/api/insurance/get-benefits',
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        }),
        observe: 'response'
      })
      .pipe(map(response => response || []));
  }
}
