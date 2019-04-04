import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { InsurancePlan, ClaimDetails } from '../../domain/ins-plans.module';

@Injectable({
  providedIn: 'root'
})
export class BlocksService {

  constructor(private http: HttpClient) { }

  activeBlocks(noOfLastBlocks: any): Observable<any> {
    return this.http.post<any>('http://localhost:3000/api/customer/blocks', noOfLastBlocks,
    {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    })
    .pipe(map(response => response || []));
  }
}
