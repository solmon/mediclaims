import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PlanService } from '../../service/plan.service';
import { Observable } from 'rxjs';
import { InsurancePlan } from '../../domain/ins-plans.module';
import { InsuranceService } from '../../service/insurance.service';

@Component({
  selector: 'app-active-plan',
  templateUrl: './active-plan.component.html',
  styleUrls: ['./active-plan.component.css']
})
export class ActivePlanComponent implements OnInit {
  // Doughnut
  public doughnutChartLabels: string[] = [];
  public doughnutChartData: number[] = [];
  public doughnutChartLabels1: string[] = [];
  public doughnutChartData1: number[] = [];
  public doughnutChartType = 'doughnut';
  plansList: any[] = [];
  enrollmentDetails: any = {};
  planDetails: any = {};
  memberDetails: any = {};
  showDetailsof: boolean[] = [];
  claimHeading: string = "Claim Details";
  constructor(private router: Router, private _planservice: PlanService,
    private _insuranceservice: InsuranceService) { }

  ngOnInit() {

    this.loadClaims();
  }

  loadClaims() {
    let customerObject = {
      customer: {
        memberUID: sessionStorage.getItem("member_uid")
      }
    }
    this._planservice.getCustomerDetails(customerObject).subscribe(response => {
      this.plansList = response.body.hce;
      this.planDetails = response.body.planDetails;
      this.memberDetails = response.body.memberDetails;
      this.enrollmentDetails = response.body.enrollmentDetails;
      this.doughnutChartLabels = ['Total', 'Claimed', 'Remaining'];
      this.doughnutChartLabels1 = ['Out-Network', 'In-Network'];
      let outTotal = 0;
      let inTotal = 0;
      // for(let i = 0; i<this.plansList.length;i++){
      //   for(let j = 0; i<this.plansList[i].procedures.length;j++){
      //       if(this.plansList[i].procedures[j].computeType == "IN"){
      //         inTotal+= parseInt(this.plansList[i].procedures[j].feeTotal);
      //       }else{
      //         outTotal+= parseInt(this.plansList[i].procedures[j].feeTotal);
      //       }
      //   }
      // }
      this.doughnutChartData[0] = parseInt(this.enrollmentDetails.coverageAmount);
      this.doughnutChartData[1] = parseInt(this.enrollmentDetails.claimedAmount);
      this.doughnutChartData[2] = parseInt(this.enrollmentDetails.remainingCoverageAmount);
      if (this.plansList != null && this.plansList.length != 0) {
        this.plansList.forEach(element => {
          this.showDetailsof.push(false);
          if (element.procedures != null && element.procedures.length != 0)
            for (let j = 0; j < element.procedures.length; j++) {
              if (element.procedures[j] != null) {
                if (element.procedures[j].computeType == "IN") {
                  inTotal += parseInt(element.procedures[j].feeTotal);
                } else {
                  outTotal += parseInt(element.procedures[j].feeTotal);
                }
              }
            }
        });
      } else {
        this.claimHeading = "No Claims Found!";
      }
      if (outTotal == 0 && inTotal == 0) {
      } else {
        this.doughnutChartData1[0] = outTotal;
        this.doughnutChartData1[1] = inTotal;
      }
    });
  }

  claimDetails() {
    this.router.navigate(['/customer/claimdetail']);
  }

  gotoHospital() {
    this.router.navigate(['/provider']);
  }
  getDetails(index) {
    if (this.showDetailsof[index] == false)
      this.showDetailsof[index] = true;
    else
      this.showDetailsof[index] = false;
  }
}
