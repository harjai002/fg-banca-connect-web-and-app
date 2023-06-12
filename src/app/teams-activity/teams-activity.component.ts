import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../services/data.service';
import { CommonService } from '../services/common.service';
import { ToastService } from '../services/components/toast.service';
import { LoderService } from '../services/components/loder.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-teams-activity',
  templateUrl: './teams-activity.component.html',
  styleUrls: ['./teams-activity.component.scss'],
})
export class TeamsActivityComponent implements OnInit {
  @ViewChild('popover') popover;
  titleMsg = 'Teams Activity';
  authUserRole: any;
  teamsData = [];
  teamsData2 = [];
  emptyRecord: boolean = true;
  authData: any;
  openFilter: boolean = false;
  userName: any;
  userFlag: number;
  constructor(private dataService: DataService, private commonService: CommonService,
    public toastService: ToastService,
    private loderService: LoderService,
    private router: Router
  ) { }

  ngOnInit() {
    // this.getData();
    // this.getRecordByUser();
    this.geAurhtData();
    this.getTeamsLeaders();
    
  }


  getTeamsActivity() {
    let loadingParams = { msg: 'Please Wait...', spinner: 'lines-sharp-small', mode: 'ios', class: 'custom-loading', backdropDismiss: true }
    this.loderService.showLoading(loadingParams);
    this.commonService.post('getDSRIndivisualCounts',{ userName: this.userName }).subscribe((res) => {
      if (res.ResponseFlag == 1) {
        console.log("teams data", JSON.parse(res.ResponseMessage));
        this.loderService.dismiss();
        this.teamsData = JSON.parse(res.ResponseMessage).Table;
      } else {
        this.toastService.toast("No record Found");
        this.loderService.dismiss();
      }
    })
  }

  getTeamsLeaders() {
    let loadingParams = { msg: 'Please Wait...', spinner: 'lines-sharp-small', mode: 'ios', class: 'custom-loading', backdropDismiss: true }
    this.loderService.showLoading(loadingParams);
    this.commonService.post('getDSRleaders',{ userName: this.userName }).subscribe((res) => {
      if (res.ResponseFlag == 1) {
        // console.log("leaders data", JSON.parse(res.ResponseMessage));
        this.loderService.dismiss();
        this.teamsData = JSON.parse(res.ResponseMessage).Table;
      } else {
        this.toastService.toast("No record Found");
        this.loderService.dismiss();
      }
    })
  }

  goToTeamActivityDetail(item: any) {
    if (item.flag == 2) {
      // console.log("if item", item);
      this.router.navigate(
        ['/dsrActivity:id?'],
        { queryParams: { item: JSON.stringify(item) } }
      );
    } else {
      // console.log("else item", item);
      this.router.navigate(
        ['/role/role1:id'],
        { queryParams: { item: JSON.stringify(item) } }
      );
    }
  }

  filterOpen() {
    this.openFilter = !this.openFilter;
  }

  geAurhtData() {
    if (localStorage.authData) {
      this.authData = JSON.parse(localStorage.getItem("authData"));
      this.userName = this.authData.EmpCode;
      this.userFlag = this.authData.flag;
    }
  }

  isOpen = false;
  collapsedBreadcrumbs: HTMLIonBreadcrumbElement[] = [];

  async presentPopover(e: Event) {
    this.collapsedBreadcrumbs = (e as CustomEvent).detail.collapsedBreadcrumbs;
    this.popover.event = e;
    this.isOpen = true;
  }


}
