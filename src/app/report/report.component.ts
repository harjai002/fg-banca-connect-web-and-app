import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../services/auth/authentication.service';
import { CommonService } from '../services/common.service';
import { LoderService } from '../services/components/loder.service';
import { ToastService } from '../services/components/toast.service';
import { ExcelexportService } from '../services/excelexport.service';
import { IonicSelectableComponent } from 'ionic-selectable';
class Banks {
  public bank_Name: string;
}
@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss'],
})
export class ReportComponent implements OnInit {
  banks: Banks[];
  bank: Banks;

  filterSearch: any;
  titleMsg = 'Reports';
  openFilter: boolean = true;
  filterForm: FormGroup;
  managerForm: FormGroup;
  segmentValue: any = "manager";
  searchBar: boolean = false;
  showmangerDrop: boolean = false;
  managerData: [];
  userEmpCode: any;
  userFlag: number;
  userData: any;
  dsrDetails: boolean = true;
  filterData: any = [];
  submitted = false;
  zoneData: any;
  zoneChange: any;


  constructor(private fb: FormBuilder,
    private loderService: LoderService,
    private commonService: CommonService,
    private toastService: ToastService,
    private excelexportService: ExcelexportService,
    private authanticationSer: AuthenticationService

  ) {
  }

  ngOnInit() {
    this.getUserName();
    this.getBanks();
    this.getZones();
    // this.getDSRActivityData();
    this.filterForm = this.fb.group({
      bank: [''],
      zone: [''],
      startDate: [''],
      activity: [''],
      endDate: ['']
    });
    this.managerForm = this.fb.group({
      zone: ['', [Validators.required]],
      manager: ['', [Validators.required]],
    });
  }



  filterOpen() {
    this.openFilter = !this.openFilter;
    this.segmentValue= "manager";
    this.getBanks();
    this.getZones();
  }

  closeFilter() {
    this.openFilter = false;
  }


  getDSRActivityData() {
    // console.log("id from url", this.userEmpCode);
    let loadingParams = { msg: 'Please Wait...', spinner: 'lines-sharp-small', mode: 'ios', class: 'custom-loading', backdropDismiss: true }
    this.loderService.showLoading(loadingParams);
    this.commonService.post('getDSRdtls', { userName: this.userEmpCode }).subscribe((res) => {
      this.loderService.dismiss();
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
        this.filterData = data;
        // console.log("dsr data", this.filterData);
      } 
    }, (err) => {
      console.log(err, "error");
    })
  }


  applyFilters() {
    let formData = this.filterForm.value;
    // console.log("filter formData", formData);
    let loadingParams = { msg: 'Please Wait...', spinner: 'lines-sharp-small', mode: 'ios', class: 'custom-loading', backdropDismiss: true }
    this.loderService.showLoading(loadingParams);
    let bank = [this.filterForm.value.bank];
    let bb = [];
    var d = bank[0];
    if (d?.length > 0) {
      d.forEach(e => {
        bb.push(e.bank_Name)
      });
    }
    let frmData = {
      userId: this.userEmpCode,
      zone: formData.zone ? formData.zone : [],
      bank: formData.bank ? bb : [],
      activity: formData.activity ? formData.activity : [],
      startDate: formData.startDate ? formData.startDate : "",
      endDate: formData.endDate ? formData.endDate : ""
    }

    this.commonService.post('dSRFilter', frmData).subscribe((res) => {
      this.loderService.dismiss();
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
       
        this.filterData = data;
        // console.log("api filter data", data);
      } else {
        console.log("No Record Found ");
        this.toastService.toast("No Record Found ");
      }
    }, (err) => {
      console.log(err, "error");
      this.loderService.dismiss();
    }
    )
  }

  segmentChanged(e) {
    this.segmentValue = e.target.value;
  }

  chngeZone(e) {
    this.submitted = true;
    this.zoneChange = e.target.value;
    // console.log("zone", this.zoneChange)
    if (this.zoneChange.length != 0) {

      let loadingParams = { msg: 'Please Wait...', spinner: 'lines-sharp-small', mode: 'ios', class: 'custom-loading', backdropDismiss: true }
      this.loderService.showLoading(loadingParams);
      this.commonService.post('getLeaderDtlsWithZone', { userName: this.userEmpCode, zones: this.zoneChange }).subscribe((res) => {
        this.loderService.dismiss();
        if (res.ResponseFlag == 1) {
       
          this.managerData = JSON.parse(res.ResponseMessage).Table;
          this.showmangerDrop=false;
          if (this.managerData.length == 0) {
            this.managerData=null;
            this.showmangerDrop=true;
            this.toastService.toast("Manager Not Found !");
          }
          // console.log("Managers ", this.managerData);
        } else {
          this.toastService.toast("Manager Not Found !");
        }
      })
    }
  }



  getZones() {
    this.commonService.post('getDSRZone', { userName: this.userEmpCode }).subscribe((res) => {
      if (res.ResponseFlag == 1) {
        this.zoneData = JSON.parse(res.ResponseMessage).Table;
      } else {
  
        this.toastService.toast("Zone Not Found");
      }
    })
  }


  chngeManagers(e) {
    this.submitted = true;
    let manager = e.target.value;
    if (manager.length != 0) {
      let loadingParams = { msg: 'Please Wait...', spinner: 'lines-sharp-small', mode: 'ios', class: 'custom-loading', backdropDismiss: true }
      this.loderService.showLoading(loadingParams);
      this.commonService.post('ZoneManagerfilters', { zone: this.zoneChange, manager: manager }).subscribe((res) => {
        this.loderService.dismiss();
        if (res.ResponseFlag == 1) {
          let data = JSON.parse(res.ResponseMessage).Table;
          for (let i = 0; i < data.length; i++) {
            if (data[i].subTypeOfActivity.length > 10) {
              data[i].subTypeOfActivity = JSON.parse(data[i].subTypeOfActivity);
              // console.log("sub data", data[i].subTypeOfActivity);
            } else {
              data[i].subTypeOfActivity = [];
              this.toastService.toast("Data Not Found");
            }
          }
          this.filterData = data;
          // console.log("dsr data", data);
        } else {
  
          this.toastService.toast("Data Not Found");
        }
      }, (err) => {
        console.log(err, "error");
      })
    }

  }

  getBanks() {
    let loadingParams = { msg: 'Please Wait...', spinner: 'lines-sharp-small', mode: 'ios', class: 'custom-loading', backdropDismiss: true }
    this.loderService.showLoading(loadingParams);
    this.commonService.get('getDSRBanks').subscribe((res) => {
      this.loderService.dismiss();
      if (res.ResponseFlag == 1) {
        this.banks = JSON.parse(res.ResponseMessage).Table;
        // console.log("Banks found",this.banks);
      } else {
        console.log("Banks not found");
      }
    }), (err) => {
      console.log("error", err);
    }
  }



  getUserName() {
    // this.userData = this.authanticationSer.getSession('authData');
    const get = this.authanticationSer.getSession('authData');
    this.userData = JSON.parse(atob(get));
    this.userEmpCode = this.userData.EmpCode;
    this.userFlag = this.userData.flag;
  }

  clearFilterForm() {
    this.filterForm.reset();
    // this.getDSRActivityData();
    this.filterData.length = [0];
  }

  excelExport(tblId: any) {
    let d = this.excelexportService.exportExcel(tblId, 'DSR-Activity');
  }

  searchIcon() {
    this.searchBar = !this.searchBar;
  }

  clearManagerFilter() {
    this.managerForm.reset();
    this.getUserName();
    this.filterData.length = [0];
    // this.getDSRActivityData();
  }
}
