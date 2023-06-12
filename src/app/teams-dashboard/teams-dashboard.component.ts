import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AuthenticationService } from '../services/auth/authentication.service';
import { CommonService } from '../services/common.service';
import { LoderService } from '../services/components/loder.service';
import { ToastService } from '../services/components/toast.service';
import { DataService } from '../services/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-teams-dashboard',
  templateUrl: './teams-dashboard.component.html',
  styleUrls: ['./teams-dashboard.component.scss'],
})
export class TeamsDashboardComponent implements OnInit {
  titleMsg = 'Team Activity Dashboard';
  managerForm: FormGroup;
  authUserRole: any;
  teamsData = [];
  filterData = [];
  managerData: any;
  submitted = false;
  userData: any;
  userRole: any;
  openFilter: boolean = false;
  userName: any;
  userEmpCode: any;
  sum = 0;
  userFlag: any;
  userZone: any;
  zoneData: any;
  yesturdayDate: any;
  month: any;
  yesturdayCount: number;
  monthCount: number;
  totalPremium: any;
  dsrCount: any;
  typeOfActivityData = []
  constructor(private dataService: DataService,
    private loderService: LoderService,
    private toastService: ToastService,
    private commonService: CommonService,
    private fb: FormBuilder,
    private toastController: ToastController,
    private authanticationSer: AuthenticationService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.geAurhtData();
    this.getTeamsLeaders();
    this.getCounts();
    // this.getMonthData();
    // this.getYesturadyData();
    this.managerForm = this.fb.group({
      zone: ['', [Validators.required]],
      manager: ['', [Validators.required]],
    });
  }


  geAurhtData() {
    this.route.queryParamMap.subscribe((params: any) => {
      if (params.params.item) {
        let item = params.params.item;
        let decodeItem = JSON.parse(atob(item));
        this.userEmpCode = decodeItem.id;
        this.totalPremium = decodeItem.sum;
        this.dsrCount = decodeItem.Count;
      } else {
        if (sessionStorage.authData) {
          const get = this.authanticationSer.getSession('authData');
          this.userData = JSON.parse(atob(get));
          this.userEmpCode = this.userData.EmpCode;
          this.userFlag = this.userData.flag;
          this.userZone = this.userData.zone;
        } else {
          this.router.navigateByUrl("/login");
        }
      }
    });
  }



  getData() {
    this.teamsData = this.dataService.LeaderData;
  }

  getTeamsLeaders() {
    this.yesturdayDate = new Date();
    this.month = new Date();
    this.yesturdayDate.setDate(this.yesturdayDate.getDate() - 1);
    this.month.setMonth(this.month.getMonth());
    let loadingParams = { msg: 'Please Wait...', spinner: 'lines-sharp-small', mode: 'ios', class: 'custom-loading', backdropDismiss: true }
    this.loderService.showLoading(loadingParams);
    this.commonService.post('getDSRleaders', { userName: this.userEmpCode }).subscribe((res) => {
      this.loderService.dismiss();
      if (res.ResponseFlag == 1) {  
        this.teamsData = JSON.parse(res.ResponseMessage).Table;
        // console.log("ddddd", this.teamsData);
      } else {
        // this.toastService.toast("No record Found");
      }
    })
  }

  getCounts() {
    this.getYesturadyData();
    this.getMonthData();
  }

  filterOpen() {
    this.openFilter = !this.openFilter;
    this.getZones();
  }

  getYesturadyData() {
    this.sum = 0;
    this.typeOfActivityData = [
      { type: "Bank Branch visit", count: 0, mnthCount: 0 },
      { type: "Bank Zonal office", count: 0, mnthCount: 0 },
      { type: "Bank Regional office", count: 0, mnthCount: 0 },
      { type: "Customer service", count: 0, mnthCount: 0 },
      { type: "Promotional activity", count: 0, mnthCount: 0 },
      { type: "Joint call with supevisor", count: 0, mnthCount: 0 },
      { type: "Review/Office Meeting", count: 0, mnthCount: 0 },
      { type: "Corporate salary", count: 0, mnthCount: 0 },
      { type: "Policy Issuance/Other Back office work", count: 0, mnthCount: 0 },
    ]
    // let loadingParams = { msg: 'Loading Wait...', spinner: 'lines-sharp-small', mode: 'ios', class: 'custom-loading', backdropDismiss: true }
    // this.loderService.showLoading(loadingParams);
    this.commonService.post('getDSRlastday', { userName: this.userEmpCode }).subscribe((res) => {
      if (res.ResponseFlag == 1) {
        // this.loderService.dismiss();
        let data = JSON.parse(res.ResponseMessage).Table;
        // console.log("yesturady data", data);
        for (var i = 0; i < data.length; i++) {
          this.typeOfActivityData.forEach(element => {
            if (element.type == data[i].type_Of_Activity) {
              element.count = data[i].count;
              // sum+=data[i].count;
              this.sum += data[i].count;
              // console.log(element);
            } else {
              console.log("Data Not Found");
            }
          });
        }
        this.yesturdayCount = this.sum;
        // console.log(this.typeOfActivityData, "sum", this.yesturdayCount);
        // console.log("sum", this.yesturdayCount);
      } else {
        // this.loderService.dismiss();
      }
    })
  }

  getMonthData() {
    this.monthCount = 0;
    this.typeOfActivityData = [
      { type: "Bank Branch visit", count: 0, mnthCount: 0 },
      { type: "Bank Zonal office", count: 0, mnthCount: 0 },
      { type: "Bank Regional office", count: 0, mnthCount: 0 },
      { type: "Customer service", count: 0, mnthCount: 0 },
      { type: "Promotional activity", count: 0, mnthCount: 0 },
      { type: "Joint call with supevisor", count: 0, mnthCount: 0 },
      { type: "Review/Office Meeting", count: 0, mnthCount: 0 },
      { type: "Corporate salary", count: 0, mnthCount: 0 },
      { type: "Policy Issuance/Other Back office work", count: 0, mnthCount: 0 },
    ]
    // let loadingParams = { msg: 'Loading Wait...', spinner: 'lines-sharp-small', mode: 'ios', class: 'custom-loading', backdropDismiss: true }
    // this.loderService.showLoading(loadingParams);
    this.commonService.post('getDSRlastMonth', { userName: this.userEmpCode }).subscribe((res) => {
      if (res.ResponseFlag == 1) {
        // this.loderService.dismiss();
        let data = JSON.parse(res.ResponseMessage).Table;
        // console.log("month data", data);
        let sum = 0;
        for (var i = 0; i < data.length; i++) {
          this.typeOfActivityData.forEach(element => {
            if (element.type == data[i].type_Of_Activity) {
              element.mnthCount = data[i].count;
              this.monthCount += data[i].count;
              // console.log(element);
            } else {
              // console.log("Data Not Found");
            }
          });
        }
        // this.monthCount=sum;
        // console.log(this.typeOfActivityData);
      } else {
        // this.loderService.dismiss();
      }
    })
  }

  getZones() {
    this.commonService.post('getDSRZone', { userName: this.userEmpCode }).subscribe((res) => {
      if (res.ResponseFlag == 1) {
        this.zoneData = JSON.parse(res.ResponseMessage).Table;
        // console.log("Zone data ", this.zoneData);
      } else {
        this.toastService.toast("Zone Not Found");
      }
    })
  }

  chngeZone(e) {
    this.submitted = true;
    let zone = e.target.value;
    if (zone.length != 0) {
      this.commonService.post('getLeaderDtlsWithZone', { userName: this.userEmpCode, zones: zone }).subscribe((res) => {  
     if (res.ResponseFlag == 1) {
          this.teamsData = JSON.parse(res.ResponseMessage).Table;
          if (this.teamsData.length == 0) {
            this.toastService.toast("No Records Found.!");
          }
          // console.log("Managers ", this.teamsData);
        } else {
          this.toastService.toast("No Records Found.!");
        }
      })
    } else {
      this.geAurhtData();
      this.getTeamsLeaders();
    }

  }

  chngeManagers(e) {
    this.submitted = true;
    let manager = e.target.value;
    // let loadingParams = { msg: 'Please Wait...', spinner: 'lines-sharp-small', mode: 'ios', class: 'custom-loading', backdropDismiss: true }
    // this.loderService.showLoading(loadingParams);
    this.commonService.post('getLeaderDtlsWithZone', { zone: [], manager: manager }).subscribe((res) => {
      if (res.ResponseFlag == 1) {
        let data = JSON.parse(res.ResponseMessage).Table;
        for (let i = 0; i < data.length; i++) {
          if (data[i].subTypeOfActivity.length > 10) {
            data[i].subTypeOfActivity = JSON.parse(data[i].subTypeOfActivity);
            // console.log("sub data", data[i].subTypeOfActivity);
          } else {
            data[i].subTypeOfActivity = [];
          }
        }
        if (data.length != 0) {
          this.filterData = data;
          // console.log("dsr data", data);
        }
        else {
          this.filterData = [];
        }
      } else {
        this.toastService.toast("Data Not Found");
      }
    }, (err) => {
      console.log(err, "error");
    })
  }

  clearManagerFilter() {
    this.managerForm.reset();
    this.geAurhtData();
    this.getTeamsLeaders();
  }

}
