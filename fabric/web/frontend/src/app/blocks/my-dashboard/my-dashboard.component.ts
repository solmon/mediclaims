import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InsurancePlan } from '../../domain/ins-plans.module';
import { BlocksService } from '../service/blocks-service.service';
import { InsuranceService } from '../../service/insurance.service';
import { Block } from '../../domain/blocks.module';


@Component({
  selector: 'app-my-dashboard',
  templateUrl: './my-dashboard.component.html',
  styleUrls: ['./my-dashboard.component.css']
})
export class MyDashboardComponent implements OnInit {
  blockData: Block[];
  noOfLastBlocks: number;

  constructor(private router: Router, private _blocksService: BlocksService) { }

  ngOnInit() {
    this.loadBlocks(100);
  }

  loadBlocks(numblocks: any) {
    const searchObject = {
      noOfLastBlocks: numblocks
    };
    this._blocksService.activeBlocks(searchObject).subscribe((data) => {
      if (data != null) {
        this.blockData = data;
        console.log(data);
      }
    });
  }
}
