import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { HealthCareEventService } from '../../service/health-care-event.service';


@Component({
  selector: 'app-starting-page',
  templateUrl: './starting-page.component.html',
  styleUrls: ['./starting-page.component.css']
})
export class StartingPageComponent implements OnInit {

  dialogRef: any;
  isProvider: boolean = false;
  constructor(private router: Router, public dialog: MatDialog) {
    if (sessionStorage.getItem('physician_uid') == null)
      this.isProvider = true;
    console.log("isProvider", this.isProvider);
  }

  ngOnInit() {
  }

  raiseClaims() {
    this.router.navigate(['/provider/dashboard']);
  }

  raiseHealthCareEvent() {
    this.router.navigate(['/provider/health-care-event'])
  }

  addPhysician() {
    this.router.navigate(['/provider/add-physician'])
  }


  showService() {
    this.dialogRef = this.dialog.open(AddServiceComponent, {
      disableClose: false,
      data: {
        title: "Add Service",
        message: null
      }
    });
  }
}

//add Rule
@Component({
  selector: 'app-add-service-dialog',
  templateUrl: 'add-service-dialog.html',
  styleUrls: ['./starting-page.component.css']
})
export class AddServiceComponent implements OnInit {
  title: string;
  dialogRef: any;
  ngOnInit(): void {
  }
  constructor(public dialog: MatDialog, private _dialogRef: MatDialogRef<StartingPageComponent>, @Inject(MAT_DIALOG_DATA) public data: any, public healthService: HealthCareEventService) {
    this.title = data.title;
  }


  addService(code, title, fee) {
    this._dialogRef.close();
    let serviceData = {
      provider: {
        providerUID: sessionStorage.getItem("provider_uid"),
        service: {
          serviceCode: code,
          serviceTitle: title,
          feeTotal: parseInt(fee)
        }
      }
    }
    this.healthService.addService(serviceData).subscribe((response) => {
      console.log(response);
      if (response.status === 200) {
        this.dialogRef = this.dialog.open(ServiceSuccess, {
          disableClose: false, data: {
            message: "Service Added Sucessfully"
          }
        });
      }
    });
  }
}

//add Rule
@Component({
  selector: 'app-service-success-dialog',
  templateUrl: 'service-success-dialog.html',
  styleUrls: ['./starting-page.component.css']
})
export class ServiceSuccess implements OnInit {
  dataVal: string;
  ngOnInit(): void {
  }
  constructor(private _dialogRef: MatDialogRef<StartingPageComponent>, @Inject(MAT_DIALOG_DATA) public data: any, public healthService: HealthCareEventService) {
    this.dataVal = data.message;
  }

  closeDialog() {
    this._dialogRef.close();
  }
}
