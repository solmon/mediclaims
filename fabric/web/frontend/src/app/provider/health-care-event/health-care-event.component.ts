import { Component, OnInit, Inject } from '@angular/core';
import { HealthCareEventService } from '../../service/health-care-event.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';

@Component({
  selector: 'app-health-care-event',
  templateUrl: './health-care-event.component.html',
  styleUrls: ['./health-care-event.component.css']
})
export class HealthCareEventComponent implements OnInit {
  dialogRef: any;
  enrollment: any;
  isProvider: boolean = false;
  patientDetails: any;
  physicianDetail: any
  benefitDetails: any;
  physician: any;
  physicianList: any[] = [];
  isLoading: boolean = true;
  issearchdata: boolean = false;
  isgetdata: boolean = false;
  physicianDetailList: any[] = []
  constructor(public dialog: MatDialog, private _healthService: HealthCareEventService) { }

  ngOnInit() {
    this.getPhysicianList()
  }
  getDetails(searchData) {
    this.getPhysicianList()
    if ((this.physicianList != null && this.physicianList.length != 0)||(this.physician!=null && this.physicianDetail!=null)) {
      let searchObject = {
        hospital: {
          ssn: searchData
        }
      }
      console.log(searchObject)
      this._healthService.getDetails(searchObject).subscribe((response) => {
        if (response.status == 200) {
          console.log(response.body)
          this.patientDetails = response.body;
          if (this.patientDetails.patientEmail != null) {
            this.issearchdata = true;
            this.isLoading = false;
            this.isgetdata = false;
            console.log("patient data", this.patientDetails);
            this._healthService.getEnrollment(searchObject).subscribe((response) => {
              console.log("response", response);
              this.enrollment = response.body[0];
              this._healthService.getBenefitList().subscribe((result) => {
                if (result.length != 0) {
                  for (let i = 0; i < result.length; i++) {
                    if (result[i].benefitId === this.enrollment.benefitId) {
                      this.benefitDetails = result[i];
                    }
                  }
                }
              });
            });
          } else {
            this.issearchdata = false;
            this.isLoading = true;
            this.isgetdata = false;
            this.dialogRef = this.dialog.open(ErrorComponent, {
              disableClose: false,
              data: {
                message: "Patient not found!"
              }
            });
          }
        }
      });
    } else {
      this.dialogRef = this.dialog.open(ErrorComponent, {
        disableClose: false,
        data: {
          message: "Please add a physician first!"
        }
      });
    }
  }

  raiseHce() {
    if (this.physician != null) {
      if (this.enrollment == null) {
        this.issearchdata = false;
        this.isLoading = true;
        this.isgetdata = false;
        this.dialogRef = this.dialog.open(ErrorComponent, {
          disableClose: false,
          data: {
            message: "Patient not enrolled!"
          }
        });
      } else {
        this.isgetdata = true;
      }
    } else if (this.physician == null) {
      this.dialogRef = this.dialog.open(ErrorComponent, {
        disableClose: false,
        data: {
          message: "Please select some physican!"
        }
      });
    }
  }
  setPhysician(data: String, j) {
    console.log(data)
    this.physician = data;
    this.physicianDetail = { "name": data, "physicianUid": this.physicianDetailList[j].physicianUid };
    console.log(this.physicianDetail)
  }

  getPhysicianList() {
    if (sessionStorage.getItem('physician_uid') == null) {
      this.isProvider = true;
      this._healthService.getPhysicianList().subscribe((result) => {

        this.physicianList = [];
        this.physicianDetailList = [];
        result.forEach(element => {
          if (element.providerUid === sessionStorage.getItem("provider_uid")) {
            this.physicianList.push(element.firstName + " " + element.lastName);
            this.physicianDetailList.push(element);
          }
        });
      });
      console.log(this.physicianList);
    }
    else {
      this.physician = sessionStorage.getItem('physician_name')
      this.physicianDetail = { "name": this.physician, "physicianUid": sessionStorage.getItem('physician_uid') };
    }
  }
}

// popup component
@Component({
  selector: 'app-error-dialog',
  templateUrl: 'error-dialog.html',
  styleUrls: ['./health-care-event.component.css']
})
export class ErrorComponent {
  input: string;
  constructor(private _dialogRef: MatDialogRef<HealthCareEventComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.input = data.message;
  }
  activeClaim() {
    this._dialogRef.close();
  }
}
