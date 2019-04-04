import { Component, OnInit,Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { InsuranceService } from '../../service/insurance.service';
import { InsuranceServiceService } from '../service/insurance-service.service';
import { parse } from 'url';
import {SigninComponent} from '../../user/insurance-signin/signin.component';
import { AuthService } from '../insurance-auth.service';





@Component({
  selector: 'add-benefit-dialog',
  templateUrl: 'success.html',
  styleUrls: ['./starting-page.component.css']
})
export class SuccessComponent {
  constructor(private _dialogRef: MatDialogRef<StartingPageComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    private _router: Router) { }
  closeDialog() {
    this._dialogRef.close();
    this._router.navigate(['/insurance']);
  }
}


 
// procedure component
@Component({
  selector:'app-claim-plan-dialog',
  templateUrl:'providers-dialog.html',
  styleUrls:['./starting-page.component.css']
})
export class TrusteeComponent implements OnInit{
  ngOnInit(): void {
    
  }
 
  providerList:any[]=[];
  providerObject:any;
 constructor(private _dialogRef: MatDialogRef<StartingPageComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { 
    
  this.providerList=this.data;
}
 
 providerSelected(provider,i) {
  this.providerObject={
    "insurance":{
          "insuranceUid": sessionStorage.getItem("insurance_uid"),
          "providerUid": this.providerList[i].providerUid
    }
  }
     
   }
   addProvider(){
    this._dialogRef.close(this.providerObject);
   }
}


//add Rule
@Component({
  selector:'app-add-rule-dialog',
  templateUrl:'add-rule-dialog.html',
  styleUrls:['./starting-page.component.css']
})
export class AddRuleComponent implements OnInit{
  benefitList:any[];
 
  ruleObject:any={
    "benefit":{
          "benefitID": "",
      "rule":{
        "ruleCode": "",
        "coverageAmount": 0,
        "inCoverage": 0,
        "outCoverage":0
  
      }
    }
  }
  ngOnInit(): void {
    this.insuranceService.getBenefit().subscribe((result) => {
      console.log("benefits",result);
      this.benefitList=result;
    });
  }
  constructor(private _dialogRef: MatDialogRef<StartingPageComponent>,@Inject(MAT_DIALOG_DATA) public data: any, public insuranceService:InsuranceServiceService){
    insuranceService.getBenefit().subscribe((result) => {
      console.log("benefits",result);
      this.benefitList=result;
    });
  }

  benefitSelected(benefit,i){
      this.ruleObject.benefit.benefitID=this.benefitList[i].benefitId;
  }
  addRule(ruleCode,coverageAmount,inCoverage,outCoverage){
   this.ruleObject.benefit.rule.ruleCode=ruleCode;
   this.ruleObject.benefit.rule.coverageAmount=parseInt(coverageAmount);
   this.ruleObject.benefit.rule.inCoverage=parseInt(inCoverage);
   this.ruleObject.benefit.rule.outCoverage=parseInt(outCoverage);
   this._dialogRef.close(this.ruleObject);
  }
}




@Component({
  selector: 'app-starting-page',
  templateUrl: './starting-page.component.html',
  styleUrls: ['./starting-page.component.css']
})
export class StartingPageComponent implements OnInit {
   
  dialogRef:any;
  providerList:any[]=[];
  constructor(public dialog: MatDialog,private router: Router, public insuranceService:InsuranceServiceService, public  authService:AuthService) { 
    
  }
  
  ngOnInit() {
    
  }
  
  checkClaims()
  {
    this.router.navigate(['/insurance/dashboard']);
  }
  
  addBenefit()
  {
    this.router.navigate(['/insurance/addplanandenrolment','plan']);
  }

  addProvider()
  {
    this.providerList=[];
    this.insuranceService.getProvidersList().subscribe((result)=>{
      console.log("providers List",result);
      if(result!=null){
        let insuranceLogin = {
          insurance: {
            email: sessionStorage.getItem('insurance_email'),
            password: sessionStorage.getItem('insurance_password')
          }
        }
        this.authService.tryLogin(insuranceLogin).subscribe((result1) => {
          if (result1.body.authenticated === true) {
          let fetchedList = result1.body.providers;
          if(fetchedList == null){
            fetchedList = [];
          }
          let addProvider = false;
          result.forEach(element => {
            addProvider=true;
            fetchedList.forEach(element1 => {
              if(element.providerUid==element1){
                    addProvider=false;
              }
            });
            if(addProvider==true){
              this.providerList.push(element);
            }
          });
          }
        });
        // this.signin.insuranceLogin.insurance.email=sessionStorage.getItem('insurance_email');
        // this.signin.insuranceLogin.insurance.password=sessionStorage.getItem('insurance_password');
        // console.log("email",this.signin.insuranceLogin.insurance.email);
        // console.log("password",this.signin.insuranceLogin.insurance.password);
        // //signin.signIn();
        // console.log("list of providers",sessionStorage.getItem('providers'));
        this.dialogRef = this.dialog.open(TrusteeComponent, {
          disableClose: false, data: this.providerList
        });

        this.dialogRef.afterClosed().subscribe((result)=>{
          console.log(result);
          if(result!=null){
            this.insuranceService.addtrustedProvider(result).subscribe((response)=>{
             console.log(response);
             if (response.status === 200) {
               this.dialogRef=this.dialog.open(SuccessComponent,{
                 disableClose: false, data: "Trustee Added Sucessfully"
               });
             }
            });
          }
   });
      }
    });
    
    
  }

  addEnrolment()
  {
    this.router.navigate(['/insurance/addplanandenrolment','enrollment']);
  }

  addMember()
  {
    this.router.navigate(['/insurance/addmember']);
  }
  addRule()
  {
    this.dialogRef=this.dialog.open(AddRuleComponent,{
      disableClose: false
    });
    this.dialogRef.afterClosed().subscribe(result=>{
      console.log("data is",result);
      this.insuranceService.addRule(result).subscribe((response)=>{
        console.log(response);
          if (response.status === 200) {
            this.dialogRef=this.dialog.open(SuccessComponent,{
              disableClose: false, data: "Rule Added Sucessfully"
            });
          }
      });
    });
  }
}
