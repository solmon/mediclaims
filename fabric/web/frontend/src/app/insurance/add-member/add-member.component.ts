import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { InsuranceServiceService } from '../service/insurance-service.service';


// popup component
@Component({
  selector: 'app-claim-plan-dialog',
  templateUrl: 'linked-claim-dialog.html',
  styleUrls: ['./add-member.component.css']
})
export class SuccessDialogComponent {
  constructor(private _dialogRef: MatDialogRef<AddMemberComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    private _router: Router) { }
  activeClaim() {
    this._dialogRef.close();
    this._router.navigate(['/insurance/landingpage']);
    
  }

}

@Component({
  selector: 'app-add-member',
  templateUrl: './add-member.component.html',
  styleUrls: ['./add-member.component.css']
})
export class AddMemberComponent implements OnInit {

  dialogRef:any;
  
  constructor(public dialog: MatDialog,private insuranceService: InsuranceServiceService) { }

  ngOnInit() {
  }
  
  addMember(empId,ssn,dob,companyID,companyName){
    let memberObject={
      member:{
        patientUID: "",
        employeeID: empId,
        ssn: ssn, 
        dob: dob,
        companyID: companyID,
        companyName:companyName
      }
    }
    console.log("memberObject",memberObject);
    if(empId!="" && ssn!=""&& dob!="" && companyID!=""&&companyName!=""){
      this.insuranceService.addMember(memberObject).subscribe((result)=>{
        console.log(result);
        if (result.status === 200) {
          this.dialogRef=this.dialog.open(SuccessDialogComponent,{
              disableClose: false
          });
    }
  });
   
  }
 }
}
