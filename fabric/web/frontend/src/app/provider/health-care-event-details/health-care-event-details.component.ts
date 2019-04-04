import { Component, OnInit, Inject, ViewEncapsulation, Input, OnChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';
import { HealthCareEventService } from '../../service/health-care-event.service';
import { formatDate } from '@angular/common';

export class HCE {
  ssn: string;
  date: string;
  patientID: string;
  patientName: string;
  insuranceID: string;
  insuranceProvider: string;
  coPay: string;
  totalFee: string;
  status: string;
  admissionDate: string;
  address: string;
  groupPlan: string;
  groupNumber: number;
  empID: number;
  dob: string;
  physician: string;
  diagnosisDescription: string;
  treatmentDetails: string[];
}

// popup component
@Component({
  selector: 'app-hce-plan-dialog',
  templateUrl: 'linked-claim-dialog.html',
  styleUrls: ['./health-care-event-details.component.css']
})
export class LinkedHCEDialogComponent {
  input: string;
  constructor(private _dialogRef: MatDialogRef<HealthCareEventDetailsComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    private _router: Router) {
    this.input = data.message;
  }
  activeClaim() {
    this._dialogRef.close();
    this._router.navigate(['/provider']);

  }
}

// popup component
@Component({
  selector: 'app-error-dialog',
  templateUrl: 'error-dialog.html',
  styleUrls: ['./health-care-event-details.component.css']
})
export class ErrorComponent {
  input: string;
  constructor(private _dialogRef: MatDialogRef<HealthCareEventDetailsComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    private _router: Router) {
    this.input = data.message;
  }
  activeClaim() {
    this._dialogRef.close();
  }
}
// procedure component
@Component({
  selector: 'app-claim-plan-dialog',
  templateUrl: 'procedure-claim-dialog.html',
  styleUrls: ['./health-care-event-details.component.css']
})
export class RaiseProceduresComponent {
  providerList: any[] = [];
  procedureList: any[] = [];
  providerName: String;
  procedureName: String;
  procedureIndex: any;
  providerIndex: any;
  constructor(private _dialogRef: MatDialogRef<HealthCareEventDetailsComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    private _healthcareeventservice: HealthCareEventService) {
    this._healthcareeventservice.provider().subscribe((data) => {
      this.providerList = data;
    });
    console.log("providerList", this.providerList);
  }
  activeClaim(fromDate, toDate) {

    this._dialogRef.close([{
      "procedureCode": this.providerList[this.providerIndex].services[this.procedureIndex].serviceCode,
      "dateFrom": fromDate,
      "dateTo": toDate,
      "providerUid": this.providerList[this.providerIndex].providerUid,
      "procedureTitle": this.providerList[this.providerIndex].services[this.procedureIndex].serviceTitle,
      "insuranceCoverage": 0,
      "insurancePercentage": 0,
      "payerPercentage": 0,
      "feeTotal": this.providerList[this.providerIndex].services[this.procedureIndex].feeTotal,
      "status": "N"
    }, this.providerList[this.providerIndex].providerName]);
  }
  providerSelected(index) {
    this.providerIndex = index;
    this.providerName = this.providerList[index].providerName;
    this.procedureList = this.providerList[index].services;

  }
  procedureSelected(index) {
    this.procedureIndex = index;
    this.procedureName = this.providerList[this.providerIndex].services[index].serviceTitle;
    console.log("procedure has selected", this.procedureName);
    console.log("procedure index", this.procedureIndex);
  }
}


@Component({
  selector: 'app-health-care-event-details',
  templateUrl: './health-care-event-details.component.html',
  styleUrls: ['./health-care-event-details.component.css',]
})
export class HealthCareEventDetailsComponent implements OnInit {

  @Input() enrollmentData: any;
  @Input() physicianDetail: any;
  @Input() patientDetails: any;
  @Input() benefitDetails: any;
  dialogRef: any;
  form: FormGroup;
  procedureDetails: any[] = [];
  totalCost: number = 0.00;
  providerName: any[] = [];

  constructor(public dialog: MatDialog, private _healthcareeventservice: HealthCareEventService) {
  }

  ngOnInit() {
    console.log("enrollment", this.enrollmentData);
  }

  addProcedure() {
    this.dialogRef = this.dialog.open(RaiseProceduresComponent, {
      disableClose: false
    });
    this.dialogRef.afterClosed().subscribe(result => {

      if (result[0]["procedureCode"] != null && result[0]["providerUid"] != null && result[0]["dateTo"] != "" && result[0]["dateFrom"] != "" && result[0]["feeTotal"] != null) {
        console.log("result is ", result);
        this.procedureDetails.push(result[0]);
        this.providerName.push(result[1]);
        this.totalCost += result[0].feeTotal;
      }
    });
  }

  deleteProcedure(index, cost) {
    console.log(cost)
    this.procedureDetails.splice(index, 1);
    if (this.procedureDetails.length == 0) {
      this.totalCost = 0;
    } else {
      this.totalCost -= cost;
    }
  }

  raiseHce(comment, description) {
    if (this.procedureDetails == null || this.procedureDetails.length == 0) {
      this.dialogRef = this.dialog.open(ErrorComponent, {
        disableClose: false,
        data: {
          message: "Please add some procedures!"
        }
      });
    } else if (description == null || description.length == 0) {
      this.dialogRef = this.dialog.open(ErrorComponent, {
        disableClose: false,
        data: {
          message: "Please add some description!"
        }
      });
    } else if (comment == null || comment.length == 0) {
      this.dialogRef = this.dialog.open(ErrorComponent, {
        disableClose: false,
        data: {
          message: "Please add some comments!"
        }
      });
    } else {
      let data = {
        "hospital": {
          "enrollID": this.enrollmentData.enrollId,
          "memberUID": this.enrollmentData.memberUid,
          "benefitID": this.enrollmentData.benefitId,
          "employeeID": this.enrollmentData.employeeId,
          "patientUID": this.patientDetails.patientUid,
          "physicianUID": this.physicianDetail.physicianUid,
          "providerUID": sessionStorage.provider_uid,
          "patientTotal": 0,
          "insuranceTotal": 0,
          "date": formatDate(new Date(), 'dd/MM/yyyy', 'en-US', '+0530'),
          "status": "N",
          "physicianName": this.physicianDetail.name,
          "treatmentDescription": description,
          "procedures": this.procedureDetails,
          "comments": comment,
          "claimTotal": this.totalCost
        }
      }
      if (sessionStorage.getItem("physician_uid") != null && sessionStorage.getItem("physician_uid") != "") {
        data.hospital.physicianUID = sessionStorage.getItem("physician_uid");
      }
      console.log("hce ", data);
      this._healthcareeventservice.createHce(data).subscribe((response) => {
        if (response.status == 200) {
          this.dialogRef = this.dialog.open(LinkedHCEDialogComponent, {
            disableClose: false,
            data: {
              message: "HCE raised successfully!"
            }
          });
        }
      });
    }
  }
}
