import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap, delay } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';


@Injectable()
export class AuthService {
  _baseUrl: any = 'http://localhost:3000';

  constructor(public http: HttpClient) { }

  // store the URL so we can redirect after logging in
  redirectUrl: string;

  login(): Observable<boolean> {
    return of(true).pipe(
      delay(1000),
      tap((val) => {
        sessionStorage.setItem('providerLoggedIn', 'true');
      })
    );
  }

  public tryLogin(
    body: Object = {}
  ): Observable<HttpResponse<any>> {
    return this.http.post(this._baseUrl + '/api/hospital/auth-provider', body, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }), observe: 'response'
    });
  }

  public tryLoginPhysician(
    body: Object = {}
  ): Observable<HttpResponse<any>> {
    return this.http.post(this._baseUrl + '/api/hospital/auth-physician', body, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }), observe: 'response'
    });
  }

  public getProviders(
    body: Object = {}
  ): Observable<HttpResponse<any>> {
    return this.http.post(this._baseUrl + '/api/hospital/get-providers', body, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }), observe: 'response'
    });
  }

  public getIsLoggedIn(): boolean {
    if (sessionStorage.getItem('providerLoggedIn') === 'true') {
      return true;
    }
    return false;
  }

  logout(): void {
    sessionStorage.setItem('providerLoggedIn', 'false');
    sessionStorage.clear();
    localStorage.clear();
  }
}

