import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InsuranceServiceService } from '../service/insurance-service.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-add-plan-and-enrolment',
  templateUrl: './add-plan-and-enrolment.component.html',
  styleUrls: ['./add-plan-and-enrolment.component.css']
})
export class AddPlanAndEnrolmentComponent implements OnInit {

  toDisplay: string;
  toDisplayEnrolment: boolean = false;
  toDisplayPlan: boolean = false;
  displayInfo: boolean = false;
  dialogRef: any;
  data: string;
  typeOfBenefit: string;
  memberDetails: any;
  constructor(public dialog: MatDialog, private route: ActivatedRoute, private insuranceService: InsuranceServiceService, private _router: Router) {
    this.toDisplay = route.snapshot.paramMap.get('id');
    if (this.toDisplay == 'enrollment') {
      this.toDisplayEnrolment = true;
    }
    if (this.toDisplay == 'plan') {
      this.toDisplayPlan = true;
    }
  }

  ngOnInit() {
  }


  checkPatient(input) {
    console.log(input)
    if (input == "") {
      return "Patient hasn't linked yet";
    } else {
      return input
    }
  }

  addPlan(title, type, coverage, premium) {
    let benefitObject = {
      benefit: {
        benefitTitle: title,
        payerID: sessionStorage.getItem("insurance_uid"),
        payerTitle: sessionStorage.getItem("insurance_name"),
        typeOfBenefit: type,
        coverageAmount: parseInt(coverage),
        monthlyPremium: parseInt(premium),
        rules: []
      }
    }
    console.log(benefitObject)
    this.insuranceService.addBenefit(benefitObject).subscribe((result) => {
      console.log(result);
      if (result.status === 200) {
        this.dialogRef = this.dialog.open(AddBenefitDialogComponent, {
          disableClose: false,
          data: {
            message: "Benefit Added Successfully!"
          }
        });
      }
    });
    console.log(type);
  }

  getMemberInfo(ssn, dob, empId) {
    let memberObject: any = {
      "member": {
        "employeeID": empId,
        "ssn": ssn,
        "dob": dob
      }
    };

    this.insuranceService.getMemberInfo(memberObject).subscribe((result) => {
      if (result.body != null) {
        this.memberDetails = result.body;
        this.displayInfo = true;
      }
      else{
        this.dialogRef = this.dialog.open(DashErrorComponent, {
          disableClose: false,
          data: {
            message: "Add Member please!"
          }
        });
      }
      console.log("memberDetails", result.body);
    });
  }



  addEnrollment() {
    let enrollmentObject: any = {
      "enrollment": {
        "patientUID": this.memberDetails.patientUid,
        "employeeID": this.memberDetails.employeeId,
        "ssn": this.memberDetails.ssn,
        "benefitID": "",
        "startDate": "",
        "endDate": "",
        "coverageAmount": 0,
        "claimedAmount": 0,
        "remainingCoverageAmount": 0,
        "inHospitalSpent": 0,
        "outHospitalSpent": 0,
        "claimIndex": []
      }
    }
    this.dialogRef = this.dialog.open(EnrollDialogComponent, {
      disableClose: false
    });
    this.dialogRef.afterClosed().subscribe(result => {
      console.log("the data recieved", result);
      enrollmentObject.enrollment.benefitID = result.benefit.benefitId;
      enrollmentObject.enrollment.coverageAmount = enrollmentObject.enrollment.remainingCoverageAmount = result.benefit.coverageAmount;
      enrollmentObject.enrollment.startDate = result.startDate;
      enrollmentObject.enrollment.endDate = result.endDate;
      console.log("the enrollment data", enrollmentObject);
      this.insuranceService.addEnrollment(enrollmentObject).subscribe((result) => {
        console.log(result);
        if (result.status === 200) {
          this.dialogRef = this.dialog.open(AddBenefitDialogComponent, {
            disableClose: false,
            data: {
              message: "Enrollment Added Successfully!"
            }
          });
        }
      });
    });

  }
}



@Component({
  selector: 'add-benefit-dialog',
  templateUrl: 'add-benefit-dialog.html',
  styleUrls: ['./add-plan-and-enrolment.component.css']
})
export class AddBenefitDialogComponent {
  input: string;
  constructor(private _dialogRef: MatDialogRef<AddPlanAndEnrolmentComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    private _router: Router) {
    this.input = data.message;
  }
  closeDialog() {
    this._dialogRef.close();
    this._router.navigate(['/insurance']);
  }
}


@Component({
  selector: 'plan-list',
  templateUrl: 'plans-list.html',
  styleUrls: ['./add-plan-and-enrolment.component.css']
})

export class PlanList implements OnInit {


  benefitList: any[];
  constructor(public insuranceService: InsuranceServiceService) {
    insuranceService.getBenefit().subscribe((result) => {
      console.log("benefits", result);
      this.benefitList = result;
    });
  }

  ngOnInit(): void {
    this.insuranceService.getBenefit().subscribe((result) => {
      console.log("benefits", result);
      this.benefitList = result;
    });
  }

}

@Component({
  selector: 'enroll-dialog',
  templateUrl: 'enroll-dialog.html',
  styleUrls: ['./add-plan-and-enrolment.component.css']
})
export class EnrollDialogComponent {
  BenefitsList: any[];
  BenefitSelected: any;
  constructor(private _dialogRef: MatDialogRef<AddPlanAndEnrolmentComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    private _router: Router, private insuranceService: InsuranceServiceService) {
    insuranceService.getBenefitList().subscribe((result) => {
      this.BenefitsList = result;
    });
  }
  closeDialog(startDate, endDate) {
    console.log("data are", { "startDate": startDate, "endDate": endDate, "benefit": this.BenefitSelected });
    this._dialogRef.close({ "startDate": startDate, "endDate": endDate, "benefit": this.BenefitSelected });
  }
  getBenefitDetails(benefit, i) {
    console.log("date are", { "benefit": benefit, "index": i });
    this.BenefitSelected = this.BenefitsList[i];
  }
}


// popup component
@Component({
  selector: 'app-error-dialog',
  templateUrl: 'error-dialog.html',
  styleUrls: ['./add-plan-and-enrolment.component.css']
})
export class DashErrorComponent {
  input: string;
  constructor(private _dialogRef: MatDialogRef<AddPlanAndEnrolmentComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.input = data.message;
  }
  activeClaim() {
    this._dialogRef.close();
  }
}