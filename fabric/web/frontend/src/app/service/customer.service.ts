

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(private http: HttpClient) {

  }

  registerUser(user: any): Observable<any> {
    return this.http.post<any>('http://localhost:3000/api/customer/create-customer', user,
    {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    })
    .pipe(map(response => response || []));
  }

  findUser(user: any): Observable<any> {
    return this.http.post<any>('http://localhost:3000/api/customer/find-customer', user,
    {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    })
    .pipe(map(response => response || []));
  }


  linkUser(user: any): Observable<any> {
    return this.http.post<any>('http://localhost:3000/api/customer/link-customer', user,
    {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    })
    .pipe(map(response => response || []));
  }

  getUser(user: any): Observable<any> {
    return this.http.post<any>('http://localhost:3000/api/customer/get-customer', user,
    {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    })
    .pipe(map(response => response || []));
  }

  authenticateUser(email: any): Observable<any> {
    return this.http.post<any>('http://localhost:3000/api/customer/auth-customer', email,
    {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    })
    .pipe(map(response => response || []));
  }
}
