import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { formatDate } from '@angular/common';
import { InsurancePlan } from '../../domain/ins-plans.module';
import { InsuranceService } from '../../service/insurance.service';
import { ClaimService } from '../../service/claim.service';
import { Observable, of } from 'rxjs';
import { HealthCareEventService } from '../../service/health-care-event.service';

export class DummyClaims {
  date: string;
  patientID: string;
  patientName: string;
  insuranceID: string;
  insuranceProvider: string;
  coPay: string;
  totalFee: string;
  status: string;
}

export class DummyStatus {
  status: string;
  count: number;
}

@Component({
  selector: 'app-my-dashboard',
  templateUrl: './my-dashboard.component.html',
  styleUrls: ['./my-dashboard.component.css']
})
export class MyDashboardComponent implements OnInit {

  constructor(private router: Router, private _insuranceservice: InsuranceService,
    private _healthcareservice: HealthCareEventService) { }

  pending_claims = 0;
  today = new Date();
  jstoday = '';
  newPlan: InsurancePlan;
  activePlans: any[] = [];
  oldPlans: InsurancePlan[];
  // activePlans$: Observable<InsurancePlan[]>;

  dummyCards: DummyClaims[] = [
    {
      date: '02-04-2018', patientID: 'A234567',
      patientName: 'Mary C Nato', insuranceID: 'ZA7585768', insuranceProvider: 'Zigma Insurance',
      coPay: 'Yes', totalFee: '$2500.00', status: 'Approval Due'
    },
    {
      date: '02-04-2018', patientID: 'A999405',
      patientName: 'Mary C Nato', insuranceID: 'ZA7585768', insuranceProvider: 'Blue Cross Insurance',
      coPay: 'Yes', totalFee: '$5850.00', status: 'Approved'
    }
  ];

  dummyStatus: DummyStatus[] = [
    { status: 'Completed', count: 0 },
    { status: 'Pending', count: 0 },
    { status: 'Refused', count: 0 }
  ];

  ngOnInit() {
    this.jstoday = formatDate(this.today, 'dd-MM-yyyy hh:mm:ss a', 'en-US', '+0530');
    this.dummyStatus = [
      {
        status: 'Completed', count: 0
      },
      { status: 'Pending', count: 0 },
      { status: 'Refused', count: 0 }
    ];
    this.pending_claims = 0;
    this.loadProcedures();
  }

  getDetails() {
    this.router.navigate(['/provider/claim-details']);
  }

  loadclaims() {
    this.activePlans = [];
    this.oldPlans = [];
    this._insuranceservice.contractList().subscribe((data) => {
      if (data != null) {
        console.log(data);
        data.forEach(
          element => {
            const a = new InsurancePlan(
              element.treatmentDescription,
              element.claimId,
              element.enrollId,
              element.memberUid,
              element.benefitId,
              element.employeeId,
              formatDate(element.date, 'dd-MM-yyyy hh:mm:ss a', 'en-US', '+0530'),
              element.physicianName,
              element.procedures,
              element.comments,
              element.claimTotal,
              element.in_network,
              element.status
            );
            this.newPlan = a;
            this.pending_claims++;
            if (this.newPlan.status === 'N') {
              this.activePlans.push(this.newPlan);
              this.dummyStatus[1].count++;
              this.newPlan = InsurancePlan.CreateDefault();
            } else if (this.newPlan.status === 'F') {
              this.oldPlans.push(this.newPlan);
              this.dummyStatus[0].count++;
              this.newPlan = InsurancePlan.CreateDefault();
            } else if (this.newPlan.status === 'J') {
              this.dummyStatus[2].count++;
              this.oldPlans.push(this.newPlan);
              this.newPlan = InsurancePlan.CreateDefault();
            }
          });
      }
    });
  }

  completed(index) {
    let object = {
      "procedure": {
        "claimID": this.activePlans[index].claimId,
        "procedureUID": this.activePlans[index].procedureUid,
        "status": "C"
      }
    }
    console.log("object", object);
    this._healthcareservice.updateProcedure(object).subscribe((response) => {
      console.log(response);
      if (response.status == 200) {
        this.activePlans[index].status = "C"
        this.dummyStatus[0].count++;
        this.dummyStatus[1].count--;
      }
    });

  }
  refused(index) {
    let object = {
      "procedure": {
        "claimID": this.activePlans[index].claimId,
        "procedureUID": this.activePlans[index].procedureUid,
        "status": "D"
      }
    }
    console.log("object", object);
    this._healthcareservice.updateProcedure(object).subscribe((response) => {
      console.log(response);
      if (response.status == 200) {
        this.activePlans[index].status = "D"
        this.dummyStatus[2].count++;
        this.dummyStatus[1].count--;
      }
    });

  }

  async  delay(ms: number) {
    await new Promise(resolve => setTimeout(() => resolve(), ms)).then(() => console.log("fired"));
  }
  loadProcedures() {
    let data = {
      "provider": {
        "providerUID": sessionStorage.provider_uid
      }
    }

    if (sessionStorage.getItem("physician_uid") != null && sessionStorage.getItem("physician_uid") != "") {
      this._healthcareservice.gethceList().subscribe((response) => {
        this.activePlans = [];
        this.dummyStatus[1].count = 0;
        this.dummyStatus[0].count = 0;
        this.dummyStatus[2].count = 0;
        (response).forEach(element => {
          if (element.physicianUid == sessionStorage.getItem("physician_uid")) {
            (element.procedures).forEach(ele => {
              if (ele.providerUid == sessionStorage.provider_uid) {
                if (ele.status == 'N') {
                  this.dummyStatus[1].count++;
                }
                if (ele.status == 'D') {
                  this.dummyStatus[2].count++;
                }
                if (ele.status == 'C') {
                  this.dummyStatus[0].count++;
                }
                this.activePlans.push(ele);
              }
            });
          }
        });
      });
    } else {
      this._healthcareservice.getProcedureList(data).subscribe((response) => {
        this.activePlans = [];
        this.dummyStatus[1].count = 0;
        this.dummyStatus[0].count = 0;
        this.dummyStatus[2].count = 0;
        (response.body).forEach(element => {
          if (element.status == 'N') {
            this.dummyStatus[1].count++;
          }
          if (element.status == 'D') {
            this.dummyStatus[2].count++;
          }
          if (element.status == 'C') {
            this.dummyStatus[0].count++;
          }
          this.activePlans.push(element);
        });

      });
    }
  }
}




