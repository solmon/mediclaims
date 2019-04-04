import { Component, OnInit, Inject, ViewEncapsulation, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';
import { ClaimService } from '../../service/claim.service';
export class DummyClaims {
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
  selector: 'app-claim-plan-dialog',
  templateUrl: 'linked-claim-dialog.html',
  styleUrls: ['./claim-details.component.css']
})
export class LinkedClaimDialogComponent {
  constructor(private _dialogRef: MatDialogRef<ClaimDetailsComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    private _router: Router) { }
  activeClaim() {
    this._dialogRef.close();
    this._router.navigate(['/provider/dashboard']);
    
  }
}

// procedure component
@Component({
   selector:'app-claim-plan-dialog',
   templateUrl:'procedure-claim-dialog.html',
   styleUrls:['./claim-details.component.css']
})
export class RaiseProcedureComponent{
  providerList:any[];
  procedureList:any[];
  providerName:String;
  procedureName:String;
  constructor(private _dialogRef: MatDialogRef<ClaimDetailsComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
  private _claimservice: ClaimService ) { 
     this.providerList=this._claimservice.provider();
     
  }
  activeClaim(ICD,cost,fromDate,toDate) {
    
      this._dialogRef.close({"ICD":ICD,"provider":this.providerName,"procedure":this.procedureName,"cost":parseFloat(cost),"fromDate":fromDate,"toDate":toDate});
    }
  providerSelected(provider:any){
    this.providerName=provider;
    this.procedureList=this._claimservice.procedure(provider);
    
  }
  procedureSelected(procedure:any){
    this.procedureName=procedure;
    console.log("procedure has selected",procedure);
  }
}





@Component({
  selector: 'app-claim-details',
  templateUrl: './claim-details.component.html',
  styleUrls: ['./claim-details.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ClaimDetailsComponent implements OnInit {
  @Input() claimObject: any;
  dialogRef: any;
  form: FormGroup;
  myFiles: string[] = [];
  procedureDetails:any[]=[];
  totalCost: number=0.00;
  constructor(public dialog: MatDialog, private _claimservice: ClaimService) { }

  ngOnInit() {
    console.log(this.claimObject);
  }ngFor
  onFileChange(e) {
    for (let i = 0; i < e.target.files.length; i++) {
      this.myFiles.push(e.target.files[i]);
    }
  }
  removeFiles(index: number) {
    this.myFiles.splice(index, 1);
  }
  addProcedure(){
    this.dialogRef = this.dialog.open(RaiseProcedureComponent, {
      disableClose: false
    });
    this.dialogRef.afterClosed().subscribe(result => {
     
      if(result["ICD"]!="" && result["procedure"]!=null && result["provider"]!=null &&result["toDate"]!="" && result["fromDate"]!="" && result["cost"]!=null){
      console.log("result is ",result);
      this.procedureDetails.push(result);
      this.totalCost+=result.cost;
      }
    });
  }
  raiseClaim(physician, description, claim, comments) {
    let newClaim =
    {
      "hospital": {
        "enrollID": claim.enrollId,
        "memberUID": claim.memberUid,
        "benefitID": claim.benefitId,
        "employeeID": claim.employeeId,
        "date": "4-08-2018",
        "status": "N",
        "physicianName": physician,
        "treatmentDescription": description,
        "procedures": [],
        "comments": comments,
        "claimTotal": 250
      }
    };
    this._claimservice.fileCLaim(newClaim).subscribe((data) => {
      if (data != null) {
        console.log(data);
        this.dialogRef = this.dialog.open(LinkedClaimDialogComponent, {
          disableClose: false
        });
      }
    });
  }
}
