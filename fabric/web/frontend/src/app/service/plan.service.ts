

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Plan } from '../domain/plan.module';
import { PlanDetails, ActivePlanDetails } from '../domain/plan-details.module';
@Injectable({
  providedIn: 'root'
})
export class PlanService {

  constructor(private http: HttpClient) {

  }

  planList(searchdata: any): Observable<any> {
    return this.http.post<any>('http://localhost:3000/api/customer/search-plans', searchdata,
    {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    })
    .pipe(map(response => response || []));
  }

  linkPlan(data: any): Observable<any> {
    return this.http.post<any>('http://localhost:3000/api/customer/enter-contract', data,
    {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    })
    .pipe(map(response => response || []));
  }
  activePlan(planID: any): Observable<PlanDetails[]> {
    return this.http.get<PlanDetails[]>('https://api.myjson.com/bins/13570q')
      .pipe(map(response => response || []));
  }
  activePlanDetails(planID: any): Observable<ActivePlanDetails[]> {
    return this.http.get<ActivePlanDetails[]>('https://api.myjson.com/bins/13hxfi')
      .pipe(map(response => response || []));
  }

  getCustomerDetails(data:any):Observable<any>{
    return this.http.post<any>('http://localhost:3000/api/customer/customer-detailed-view', data,
    {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }), observe: 'response'
    })
    .pipe(map(response => response || []));
    
  }
}
