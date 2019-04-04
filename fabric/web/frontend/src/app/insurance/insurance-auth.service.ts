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
        sessionStorage.setItem('insLoggedIn', 'true');
      })
    );
  }

  public tryLogin(
    body: Object = {}
  ): Observable<HttpResponse<any>> {
    return this.http.post(this._baseUrl + '/api/insurance/auth-insurance', body, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }), observe: 'response'
    });
  }

  public getIsLoggedIn(): boolean {
    if (sessionStorage.getItem('insLoggedIn') === 'true') {
      return true;
    }
    return false;
  }

  logout(): void {
    sessionStorage.setItem('insLoggedIn', 'false');
    sessionStorage.clear();
    localStorage.clear();
  }
}

