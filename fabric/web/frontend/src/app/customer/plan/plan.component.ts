import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PlanService } from '../../service/plan.service';
import { Observable, of } from 'rxjs';
import { Plan } from '../../domain/plan.module';
@Component({
  selector: 'app-plan',
  templateUrl: './plan.component.html',
  styleUrls: ['./plan.component.css']
})
export class PlanComponent implements OnInit {
  searchForm: FormGroup;
  isLoading = false;
  searchData: any;
  issearchdata = false;
  planList$: Observable<Plan[]>;
  constructor(private fb: FormBuilder, private router: Router, private _planservice: PlanService) { }

  ngOnInit() {
    this.searchForm = this.fb.group({
      // 'ssn': ['', Validators.required],
      'empid': ['', Validators.required],
      // 'dob': ['', Validators.required],
    });
  }
  get ssn() {
    return this.searchForm.get('ssn');
  }
  get empid() {
    return this.searchForm.get('empid');
  }
  get dob() {
    return this.searchForm.get('dob');
  }
  searchPlan() {
    if (this.searchForm.valid) {
      this.isLoading = true;
      const searchObject = {
        cuser: {
          employeeId: this.empid.value
        }
      };
      this._planservice.planList(searchObject).subscribe((data) => {
        if (data != null) {
          const plans: Plan[] = [];
          plans[0] = data.planInfo;
          this.planList$ = of(plans);
          this.isLoading = false;
          this.issearchdata = true;
        }
      });
    }
  }
  goback(): void {
    this.router.navigate(['/customer']);
  }
}
