import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ClaimService } from '../../service/claim.service';

@Component({
  selector: 'app-claims',
  templateUrl: './claims.component.html',
  styleUrls: ['./claims.component.css']
})
export class ClaimsComponent implements OnInit {
  isLoading = false;
  searchData: any;
  issearchdata = false;
  claimList$: Observable<any[]>;
  constructor(private _claimservice: ClaimService) { }

  ngOnInit() {
  }
  getDetails(searchValue) {
    this.isLoading = true;
    const searchObject = {
      hospital: {
        ssn: searchValue
      }
    };
    this._claimservice.claimList(searchObject).subscribe((data) => {
      if (data != null) {
        const searchObject = {
          hospital: {
            benefitId: data[0].benefitId

          }
        };
        this._claimservice.benefitDetails(searchObject).subscribe((res) => {
          if (res != null) {
            console.log(res);
            data[0] = this.jsonConcat(data[0], res);
            console.log(data);
            const claims: any[] = data;
            this.claimList$ = of(claims);
            this.isLoading = false;
            this.issearchdata = true;
          }
        });
      }
    });
  }

  jsonConcat(o1, o2) {
    for (var key in o2) {
      o1[key] = o2[key];
    }
    return o1;
  }
}
