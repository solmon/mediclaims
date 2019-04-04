import { Component, OnInit, Inject} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { HealthCareEventService } from '../../service/health-care-event.service';
import { Session } from 'protractor';


// popup component
@Component({
  selector: 'app-claim-plan-dialog',
  templateUrl: 'add-physician-dialog.html',
  styleUrls: ['./add-physician.component.css']
})
export class SuccessDialogComponent {
  constructor(private _dialogRef: MatDialogRef<AddPhysicianComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    private _router: Router) { }
  activeClaim() {
    this._dialogRef.close();
    this._router.navigate(['/provider/landingpage']);
    
  }

}


@Component({
  selector: 'app-add-physician',
  templateUrl: './add-physician.component.html',
  styleUrls: ['./add-physician.component.css']
})
export class AddPhysicianComponent implements OnInit {

  dialogRef:any;
  constructor(public dialog: MatDialog,private healthCareEventService: HealthCareEventService) { }

  ngOnInit() {
    
  }
 
  addPhysician(email,password,firstName,lastName)
  {
     let physicianObject ={
      physician:{
        providerUID: sessionStorage.getItem('provider_uid'),
        email: email,
        password: password,
        firstName: firstName,
        lastName: lastName
	}
     }
     console.log("physicianObject",physicianObject);
     if(email!="" && password!="" && firstName != "" && lastName!="")
     {
      this.healthCareEventService.addPhysician(physicianObject).subscribe((result)=>{
        console.log(result);
        if (result.status === 200) {
          this.dialogRef=this.dialog.open(SuccessDialogComponent,{
              disableClose: false
          });
    
        }
        else{
          console.log("some error has occured",result);
        }
  });
     }
  }
}
