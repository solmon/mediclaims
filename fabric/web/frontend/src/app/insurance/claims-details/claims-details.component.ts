import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ClaimDetails } from '../../domain/ins-plans.module';
import { InsuranceServiceService } from '../service/insurance-service.service';


@Component({
  selector: 'app-claims-details',
  templateUrl: './claims-details.component.html',
  styleUrls: ['./claims-details.component.css']
})
export class ClaimsDetailsComponent implements OnInit {
  claimDetails: any={};
  myFiles: string[] = [];
  constructor(private router: Router, private _insuranceService: InsuranceServiceService) { }

  ngOnInit() {
    this._insuranceService.claimDetails('').subscribe((data) => {
      console.log(data)
      this.claimDetails = data;
    });
  }

  getDetails() {
    this.router.navigate(['/provider/claim-details']);
  }

  onFileChange(e) {
    for (let i = 0; i < e.target.files.length; i++) {
      this.myFiles.push(e.target.files[i]);
    }
  }
  removeFiles(index: number) {
    this.myFiles.splice(index, 1);
  }

  cancel() {
    this.router.navigate(['/insurance/dashboard']);
  }

}
