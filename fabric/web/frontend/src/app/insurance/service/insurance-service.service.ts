import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { InsurancePlan, ClaimDetails } from '../../domain/ins-plans.module';

@Injectable({
  providedIn: 'root'
})
export class InsuranceServiceService {

  constructor(private http: HttpClient) { }

  activePlan(planID: any): Observable<InsurancePlan[]> {
    return this.http.get<InsurancePlan[]>('../assets/insurance-plans.json')
      .pipe(map(response => response || []));
  }

  claimDetails(planID: any): Observable<ClaimDetails[]> {
    return this.http.get<ClaimDetails[]>('../assets/claim-details.json')
      .pipe(map(response => response || []));
  }

  addBenefit(data: any): Observable<any> {
    return this.http.post<any>('http://localhost:3000/api/insurance/create-benefit', data,
    {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      observe: 'response'
    })
    .pipe(map(response => response || []));
  }

  getBenefit(): Observable<any>{
    return this.http.post<any>('http://localhost:3000/api/insurance/get-benefits',
    {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      observe: 'response'
    })
    .pipe(map(response => response || []));
  }

  addMember(data: any):Observable<any>{
 
    return this.http.post<any>('http://localhost:3000/api/insurance/create-member', data,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        }),
        observe: 'response'
      })
      .pipe(map(response => response || []));
    }

  getBenefitList():Observable<any>{
    return this.http.post<any>('http://localhost:3000/api/insurance/get-benefits',
    {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      observe: 'response'
    })
    .pipe(map(response => response || []));
  }
  getMemberInfo(data:any):Observable<any>{
    return this.http.post<any>('http://localhost:3000/api/insurance/find-member',data,
    {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      observe: 'response'
    })
    .pipe(map(response => response || []));
  }
  addEnrollment(data:any):Observable<any>{
    return this.http.post<any>('http://localhost:3000/api/insurance/create-enrollment',data,
    {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      observe: 'response'
    })
    .pipe(map(response => response || []));
    
  }
  addRule(data:any):Observable<any>{
    return this.http.post<any>('http://localhost:3000/api/insurance/add-rule',data,
    {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      observe: 'response'
    })
    .pipe(map(response => response || []));
    
  }

  getProvidersList():Observable<any>{
    return this.http.post<any>('http://localhost:3000/api/hospital/get-providers',
    {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      observe: 'response'
    })
    .pipe(map(response => response || []));
    
  }

  addtrustedProvider(data:any):Observable<any>{
    return this.http.post<any>('http://localhost:3000/api/insurance/add-provider',data,
    {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      observe: 'response'
    })
    .pipe(map(response => response || []));
    
  }
}


