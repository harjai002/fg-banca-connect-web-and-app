import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../services/data.service';
import { CommonService } from '../services/common.service';
import { ToastService } from '../services/components/toast.service';
import { LoderService } from '../services/components/loder.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../services/auth/authentication.service';
@Component({
  selector: 'app-teamdemo',
  templateUrl: './teamdemo.component.html',
  styleUrls: ['./teamdemo.component.scss'],
})
export class TeamdemoComponent implements OnInit {
  @ViewChild('popover') popover;
  titleMsg = 'Teams Activity';
  authUserRole: any;
  teamsData = [];
  emptyRecord: boolean = true;
  authData: any;
  openFilter: boolean = false;
  userEmpCode: any;
  id: any;
  userFlag: number;
  empCode: any;
  pageArray: any = [];
  constructor(private dataService: DataService, private commonService: CommonService,
    public toastService: ToastService,
    private loderService: LoderService,
    private router: Router,
    private route: ActivatedRoute,
    private authanticationSer: AuthenticationService
  ) { }

  ngOnInit() {
    this.geAurhtData();
    this.getTeamsLeaders();
  }


  getTeamsLeaders() {
    if (this.authData) {
      let data = { id: this.authData.EmpCode, flag: this.authData.flag, page: false }
      this.getTeamsLeadersApi(data);
    } else {
      this.geAurhtData();
      let data = { id: this.userEmpCode, flag: this.userFlag, page: false }
      this.getTeamsLeadersApi(data);
    }
  }

  getTeamsLeadersApi(item) {
    if (item.page != true) {
      if (item.flag != 1) {
        this.pageArray.push(item);
      }
      if (item.flag > 1) {
        // console.log("leaders id", item.id);
        let loadingParams = { spinner: 'lines-sharp-small', mode: 'ios', class: 'custom-loading', backdropDismiss: true }
        this.loderService.showLoading(loadingParams);
        this.commonService.post('getDSRleaders', { userName: item.id }).subscribe((res) => {
          this.loderService.dismiss();
          if (res.ResponseFlag == 1) {
            // console.log("leaders data", JSON.parse(res.ResponseMessage));
         
            this.teamsData = JSON.parse(res.ResponseMessage).Table;
            // console.log("teams data",this.teamsData);
          } else {
            this.toastService.toast("No record Found");
          }
        })
      } else { 
        const stringifyObj = JSON.stringify(item)
        const b64Str = btoa(stringifyObj)
        // console.log(b64Str);
        this.router.navigate(
          ['/teamDashboard:id?'],
          { queryParams: { item: b64Str } }
        );
      }
    } else {
      if (item.flag > 1) {
        let loadingParams = { msg: 'Please Wait...', spinner: 'lines-sharp-small', mode: 'ios', class: 'custom-loading', backdropDismiss: true }
        this.loderService.showLoading(loadingParams);
        this.commonService.post('getDSRleaders', { userName: item.id }).subscribe((res) => {
          this.loderService.dismiss();
          if (res.ResponseFlag == 1) {
            // console.log("leaders data", JSON.parse(res.ResponseMessage));
           
            this.teamsData = JSON.parse(res.ResponseMessage).Table;
          } else {
            this.toastService.toast("No record Found");
          }
        })
      } else {
        this.router.navigate(
          ['/teamDashboard:id?'],
          { queryParams: { item: JSON.stringify(item) } }
        );
      }
    }

  }

  geAurhtData() {
    // this.authData = this.authanticationSer.getSession('authData');
    const get = this.authanticationSer.getSession('authData');
    this.authData = JSON.parse(atob(get));
    this.userEmpCode = this.authData.EmpCode;
    this.userFlag = this.authData.flag;
    // }
  }

  filterOpen() {
    this.openFilter = !this.openFilter;
  }


  backButton() {
    if (this.pageArray.length == 1) {
      this.router.navigateByUrl("/home");
    } else {
      let backData = this.pageArray.splice(-1);
      if (!backData.id) {
        backData = this.pageArray[this.pageArray.length - 1];
      }
      let data = { id: backData.id, flag: backData.flag, page: true }
      this.getTeamsLeadersApi(data);
    }

  }
}
