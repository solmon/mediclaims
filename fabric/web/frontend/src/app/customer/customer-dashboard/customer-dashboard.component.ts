import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { PlanService } from '../../service/plan.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
@Component({
  selector: 'app-customer-dashboard',
  templateUrl: './customer-dashboard.component.html',
  styleUrls: ['./customer-dashboard.component.css']
})
export class CustomerDashboardComponent implements OnInit {
  dialogRef: any;
  constructor(private router: Router, private customerService: PlanService, private dialog: MatDialog) { }

  userName = sessionStorage.getItem('user_name');
  userEmail = sessionStorage.getItem('user_email');

  //TODO : 
  //1. Fetch plans specific to a user if they already exist
  //2. Fetch Zigma id if it exists(optional)


  ngOnInit() {
  }

  claimDashboard() {
    let customerObject = {
      customer: {
        memberUID: sessionStorage.getItem("member_uid")
      }
    }
    this.customerService.getCustomerDetails(customerObject).subscribe(response => {
      console.log(response.status)
      if (response.status == 200) {
        if (response.body != null && response.body.enrollmentDetails != null && response.body.enrollmentDetails.benefitId != null && response.body.enrollmentDetails.benefitId != "") {
          this.router.navigate(['/customer/activeplan']);
        } else {
          this.dialogRef = this.dialog.open(DashErrorComponent, {
            disableClose: false,
            data: {
              message: "You aren't enrolled to any plan currently!"
            }
          });
        }
      }
    });
  }

  linkplan() {
    this.router.navigate(['/customer/plan']);
  }

  getPatientID() {
    return sessionStorage.getItem('user_patient_uid');
  }

  toTitleCase(str) {
    return str.replace(
      /\w\S*/g,
      function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      }
    );
  }

}

// popup component
@Component({
  selector: 'app-error-dialog',
  templateUrl: 'error-dialog.html',
  styleUrls: ['./customer-dashboard.component.css']
})
export class DashErrorComponent {
  input: string;
  constructor(private _dialogRef: MatDialogRef<CustomerDashboardComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.input = data.message;
  }
  activeClaim() {
    this._dialogRef.close();
  }
}