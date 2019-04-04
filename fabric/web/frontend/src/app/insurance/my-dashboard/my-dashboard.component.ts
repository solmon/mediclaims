import { Component, OnInit, Inject, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { InsurancePlan } from '../../domain/ins-plans.module';
import { InsuranceServiceService } from '../service/insurance-service.service';
import { InsuranceService } from '../../service/insurance.service';
import { ClaimService } from '../../service/claim.service';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Observable, of } from 'rxjs';
import { formatDate } from '@angular/common';


// popup component
@Component({
  selector: 'app-claim-plan-dialog',
  templateUrl: 'linked-claim-dialog.html',
  styleUrls: ['./my-dashboard.component.css']
})
export class LinkedClaimDialogComponent {
  status: any;
  constructor(private _dialogRef: MatDialogRef<MyDashboardComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    private _router: Router) {
    if (data !== null) {
      status = data.stat;
    }
  }
  onAdd = new EventEmitter();

  activeClaim() {
    this.onAdd.emit();
    this._dialogRef.close();
    //this._router.navigate(['/insurance/dashboard']);
  }
}

@Component({
  selector: 'app-my-dashboard',
  templateUrl: './my-dashboard.component.html',
  styleUrls: ['./my-dashboard.component.css']
})
export class MyDashboardComponent implements OnInit {
  today = new Date();
  jstoday = '';
  activePlans: any[];
  activePlans$: Observable<InsurancePlan[]>;
  allPlans: any[];
  dialogRef: any;
  showDetailsof:boolean[]=[]
  showDetailsofall:boolean[]=[];

  constructor(private router: Router,
    private _insuranceservice: InsuranceService,
    private insuranceService: InsuranceServiceService,
    public dialog: MatDialog, private _claimservice: ClaimService) { }

  in_network = true;

  ngOnInit() {
    this.loadPlans();
    this.jstoday = formatDate(this.today, 'dd-MM-yyyy hh:mm:ss a', 'en-US', '+0530');
  }

  loadPlans() {
    // this.insuranceService.activePlan('')
    //   .subscribe(
    //     data => {
    //       this.activePlans = [];
    //       this.oldPlans = [];
    //       data.forEach(
    //         element => {
    //           const a = new InsurancePlan(element.date,
    //             element.plan_id,
    //             element.patient_name,
    //             element.provider,
    //             element.from,
    //             element.to,
    //             element.total,
    //             element.pay,
    //             element.in_network,
    //             element.status);
    //           this.newPlan = a;
    //           if (this.newPlan.status === 'new') {
    //             this.activePlans.push(this.newPlan);
    //             this.newPlan = InsurancePlan.CreateDefault();
    //           } else if (this.newPlan.status !== 'new') {
    //             this.oldPlans.push(this.newPlan);
    //             this.newPlan = InsurancePlan.CreateDefault();
    //           }
    //         });
    //     });
    // const searchObject = {
    //   status: 'N'
    // };
    this.activePlans = [];
    this.allPlans = [];
    this._insuranceservice.contractList().subscribe((data) => {
      if (data != null) {
        console.log(data);
        data.forEach(
          element => {
            
            if (element.status === 'N') {
              this.activePlans.push(element);
              this.showDetailsof.push(false);
              // const ap: InsurancePlan[] = this.activePlans;
              // this.activePlans$ = of(ap);
            } //else if (this.newPlan.status !== 'N') {
              this.allPlans.push(element);
              this.showDetailsofall.push(false);
              //this.newPlan = InsurancePlan.CreateDefault();
            //}
          });
      }
    });
  }
  reject_claim(plan) {
    const approveObject = {
      "claim": {
        claimID: plan.claimId,
        status: 'J'
      }
    };
    console.log(approveObject);
    this._insuranceservice.processCLaim(approveObject).subscribe((data) => {
      if (data != null) {
        console.log(data);
        this.dialogRef = this.dialog.open(LinkedClaimDialogComponent, {
          data: { stat: 'false' },
          disableClose: false
        });
        const sub = this.dialogRef.componentInstance.onAdd.subscribe(() => {
          // do something
          setTimeout(() => { this.loadPlans(); }, 2000)
        });
        this.dialogRef.afterClosed().subscribe(() => {
          // unsubscribe onAdd
        });
      }
    });
  }

  getDetails(index) {
    if(!this.showDetailsof[index])
    this.showDetailsof[index]=true;
    else
    this.showDetailsof[index]=false;
  }
  getDetailsall(index) {
    if(!this.showDetailsofall[index])
    this.showDetailsofall[index]=true;
    else
    this.showDetailsofall[index]=false;
  }



  approvePlan(plan) {
    const approveObject = {
      "claim": {
        claimID: plan.claimId,
        status: 'F'
      }
    };
    console.log(approveObject);
    this._insuranceservice.processCLaim(approveObject).subscribe((data) => {
      if (data != null) {
        console.log(data);
        this.dialogRef = this.dialog.open(LinkedClaimDialogComponent, {
          data: { stat: 'true' },
          disableClose: false
        });
        const sub = this.dialogRef.componentInstance.onAdd.subscribe(() => {
          // do something
          setTimeout(() => { this.loadPlans(); }, 2000)
        });
        this.dialogRef.afterClosed().subscribe(() => {
          // unsubscribe onAdd
        });


      }
    });
  }

}

