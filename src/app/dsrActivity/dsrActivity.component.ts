import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormControl, FormArray } from '@angular/forms';
import { PopoverController } from '@ionic/angular';
import * as moment from 'moment';
import { DataService } from '../services/data.service';
import { ExcelexportService } from '../services/excelexport.service';
import { ToastService } from '../services/components/toast.service';
import { LoderService } from '../services/components//loder.service';
import { CommonService } from '../services/common.service';
import { TimeDurationService } from '../services/time-duration.service';
import * as XLSX from 'xlsx';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../services/auth/authentication.service';
import { IonicSelectableComponent } from 'ionic-selectable';
class Banks {
  public bank_Name: string;
}
class BankBranchName {
  public bankBranchName: string;
}
@Component({
  selector: 'app-dsrActivity',
  templateUrl: './dsrActivity.component.html',
  styleUrls: ['./dsrActivity.component.scss'],
})
export class DsrActivityComponent implements OnInit {
  titleMsg = "DSR Activity";
  banks: Banks[];
  bank: Banks;
  branchNames: BankBranchName[];
  branchName: BankBranchName;
  bankBranchCode: any;
  userName: any;
  userEmpCode: any;
  drsFrom: FormGroup;
  managerForm: FormGroup;
  filterForm: FormGroup;
  submitted = false;
  dsrDetails: boolean = true;
  dsrActivityAdd: boolean = false;
  searchBar: boolean = false;
  emptyRecord: boolean = true;
  startTime: any;
  endTime: any;
  Duration: any;
  subDurations: any;
  startTimes: any;
  openFilter: boolean = false;
  startDate: any;
  endDate: any;
  filterSearch = '';
  filterData: any = [];
  userFlag: any;
  authTl: any;
  userZone: any;
  segmentValue: any = "zone";
  ExecutiveName: string;
  userData: any;
  end_Time_picker: boolean = true;
  PremiumFooter: boolean = true;
  totalPremium: any;
  managerData: any;
  // banks: any=[];
  charCheck: any;
  minDate;
  maxDate;
  zoneData: any;
  clanderDate:Date;


  constructor(
    private fb: FormBuilder, private dataService: DataService,
    public popoverController: PopoverController,
    public toastService: ToastService,
    private excelexportService: ExcelexportService,
    private loderService: LoderService,
    private commonService: CommonService,
    private route: ActivatedRoute,
    private authanticationSer: AuthenticationService,
    public router: Router,
  ) {
  }


  ngOnInit() {
    this.getUserName();
    this.getBanks();
    this.getDSRActivityData();
    this.getTotalPremium();
    this.minMaxDate();
    this.drsFrom = this.fb.group({
      executive: ['', Validators.required],
      team_Leader: [''],
      auth_role: [''],
      userName: [''],
      zone: [''],
      date_Of_Visit: ['', Validators.required],
      start_Time: ['', Validators.required],
      end_Time: ['', Validators.required],
      duration: ['', Validators.required],
      type_Of_Activity: ['', Validators.required],
      subTypeOfActivity: this.fb.array([]),
      bank_Name: ['', Validators.required],
      branch_Code: ['', Validators.required],
      bank_Branch_Name: ['', Validators.required],
      // mode_Of_Transport: [''],
      // travel_From: [''],
      // travel_To: [''],
      // kilometers_Travelled: [''],
      // to_Whom_Meet: ['',Validators.compose([Validators.pattern("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9  !\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~€£¥₩])(?=.*?[A-Z 0-9]).{8,}$"), Validators.required])],
      to_Whom_Meet: ['', Validators.required],
      to_Whom_Meet_Number: ['', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$"),Validators.maxLength(10)]],
      remark_Comments: ['']
    });

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


  dateClanderChange(e:any){
    this.clanderDate=e.target.value;
    console.log("date change ",this.clanderDate);
  }

  bankLoad() {
    let loadingParams = { msg: 'Please Wait...', spinner: 'lines-sharp-small', mode: 'ios', class: 'custom-loading', backdropDismiss: true }

    setTimeout(() => {
      this.loderService.dismiss();
    }, 1000);
  }
  getBanks() {
    let loadingParams = { msg: 'Please Wait...', spinner: 'lines-sharp-small', mode: 'ios', class: 'custom-loading', backdropDismiss: true }
    // this.loderService.showLoading(loadingParams);
    this.commonService.get('getDSRBanks').subscribe((res) => {
      if (res.ResponseFlag == 1) {
        this.banks = JSON.parse(res.ResponseMessage).Table;
        // this.loderService.dismiss();
      } else {
        // this.loderService.dismiss();
        console.log("Banks not found");
      }
    }), (err) => {
      // this.loderService.dismiss();
      console.log("error", err);
    }
  }

  async bankNameChange(event: { component: IonicSelectableComponent, value: any }) {

    this.drsFrom.get('bank_Branch_Name').setValue('');
    this.drsFrom.get('branch_Code').setValue('');
    let loadingParams = { msg: 'Please Wait...', spinner: 'lines-sharp-small', mode: 'ios', class: 'custom-loading', backdropDismiss: true }
    //this.loderService.showLoading(loadingParams);
    await this.commonService.post('getDSRBankBranchDtls', event.value).subscribe((res) => {
      if (res.ResponseFlag == 1) {
        this.loderService.dismiss();
        this.branchNames = JSON.parse(res.ResponseMessage).Table;
        this.checkSpaicelChar(event);
        // console.log("branch name", this.branchNames);
      } else {
        this.loderService.dismiss();
        console.log("bank branch name not found");
      }
    }), (err) => {
      this.loderService.dismiss();
      console.log("error", err);
    }
  }

  bankBranchClick() {
    let loderTime = 0;
    if (this.branchNames.length <= 200) { console.log("1"); loderTime = 1000; }
    else if (this.branchNames.length > 200 && this.branchNames.length < 400) { loderTime = 2000; }
    else if (this.branchNames.length > 401 && this.branchNames.length < 600) { loderTime = 3000; }
    else if (this.branchNames.length > 601 && this.branchNames.length < 900) { loderTime = 4000; }
    else if (this.branchNames.length > 901 && this.branchNames.length < 3000) { loderTime = 5000; }
    else { loderTime = 3000; }
    let loadingParams = { msg: 'Please Wait...', spinner: 'lines-sharp-small', mode: 'ios', class: 'custom-loading', backdropDismiss: true }
    //this.loderService.showLoading(loadingParams);
    setTimeout(() => {
      this.loderService.dismiss();
    }, loderTime);
  }

  bankBranchNameChange(event: { component: IonicSelectableComponent, value: any }) {
    this.commonService.post('getDSRBankBranchCode', event.value).subscribe((res) => {
      if (res.ResponseFlag == 1) {
        this.bankBranchCode = JSON.parse(res.ResponseMessage).Table[0].bank_Branch_Code;
        this.checkSpaicelChar(event);
      } else {
        console.log("bank branch code not found");
      }
    }), (err) => {
      console.log("error", err);
    }
  }

  getZone() {
    this.commonService.post('DSRLogin', { userName: this.userEmpCode }).subscribe((res) => {
      if (res.ResponseFlag == 1) {
        let zone = JSON.parse(res.ResponseMessage).Table[0];
        this.drsFrom.get('zone').setValue(zone);
        // console.log("zone data", zone);
      } else {
        this.toastService.toast("Zone Not Found");
      }
    })
  }

  chngeZone(e) {
    this.submitted = true;
    let zone = e.target.value;
    if (zone.length != 0) {

      let loadingParams = { msg: 'Please Wait...', spinner: 'lines-sharp-small', mode: 'ios', class: 'custom-loading', backdropDismiss: true }
      //this.loderService.showLoading(loadingParams);
      this.commonService.post('getLeaderDtlsWithZone', { userName: this.userEmpCode, zones: zone }).subscribe((res) => {
        if (res.ResponseFlag == 1) {
          this.loderService.dismiss();
          this.managerData = JSON.parse(res.ResponseMessage).Table;
          if (this.managerData.length == 0) {
            this.toastService.toast("Manager Not Found.!!");
          }
          // console.log("Managers ", this.managerData);
        } else {
          this.loderService.dismiss();
          this.toastService.toast("Manager Not Found");
        }
      })
    }
  }


  chngeManagers(e) {
    this.submitted = true;
    let manager = e.target.value;
    if (manager.length != 0) {
      let loadingParams = { msg: 'Please Wait...', spinner: 'lines-sharp-small', mode: 'ios', class: 'custom-loading', backdropDismiss: true }
      //this.loderService.showLoading(loadingParams);
      this.commonService.post('ZoneManagerfilters', { zone: [], manager: manager }).subscribe((res) => {
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
          // console.log("dsr data", data);
          this.loderService.dismiss();
        } else {
          this.loderService.dismiss();
          this.toastService.toast("Data Not Found");
        }
      }, (err) => {
        console.log(err, "error");
      })
    }

  }

  getUserName() {
    this.route.queryParamMap.subscribe((params: any) => {
      if (params.params.item) {
        let item = JSON.parse(params.params.item);
        this.userEmpCode = item;
        // this.userFlag = item.flag;
        // console.log("url data", item);
        // this.getDSRActivityData();
      } else {
        const get = this.authanticationSer.getSession('authData');
        this.userData = JSON.parse(atob(get));
        // this.userData = this.authanticationSer.getSession('authData');
        this.userEmpCode = this.userData.EmpCode;
        this.userFlag = this.userData.flag;
        this.userZone = this.userData.zone;
        // console.log("else user id", this.userName);
      }
    });
  }

  applyFilters() {
    let formData = this.filterForm.value;
    let loadingParams = { msg: 'Please Wait...', spinner: 'lines-sharp-small', mode: 'ios', class: 'custom-loading', backdropDismiss: true }
    //this.loderService.showLoading(loadingParams);
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
        this.loderService.dismiss();
        this.filterData = data;
        // console.log("api filter data", data);
      } else {
        console.log("No Record Found ");
        this.loderService.dismiss();
        this.toastService.toast("No Record Found ");
      }
    }, (err) => {
      console.log(err, "error");
    }
    )
  }

  doRefresh(event) {
    setTimeout(() => {
      this.ngOnInit();
      event.target.complete();
    }, 4000);
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
      } else {
        this.loderService.dismiss();
      }
    }, (err) => {
      console.log(err, "error");
      this.loderService.dismiss();
    })
  }


  subTypeOfActivity() {
    return this.drsFrom.get("subTypeOfActivity") as FormArray
  }

  newSubTypeOfActivity() {
    return this.fb.group({
      subTypeOfActivity: ['', [Validators.required]],
      subStartTime: ['', [Validators.required]],
      subEndTime: ['', [Validators.required]],
      subDuration: ['', [Validators.required]],
      premium_Collected: ['', [Validators.required]],
    })
  }

  addSubTypeOfActivity() {
    this.subTypeOfActivity().push(this.newSubTypeOfActivity());
  }

  removeSubTypeActivity(i) {
    this.subTypeOfActivity().removeAt(i);
  }

  startTimeChange(e) {
    // console.log("start time", e.target.value);
    this.startTime = e.target.value;
    this.end_Time_picker = false;
    if (this.endTime >= this.startTime) {
      var ms = moment(this.endTime, "HH:mm").diff(moment(this.startTime, "HH:mm"));
      var d = moment.duration(ms);
      this.Duration = Math.floor(d.asHours()) + moment.utc(ms).format(":mm");
      // console.log("change duration", this.Duration);
    } else {
      if (this.endTime <= this.startTime) {
        this.toastService.toast("End time should be greater than start time");
        // console.log("time not match");
      }
    }
    // console.log("chesk start time and end time", this.startTime, this.endTime);
  }

  endTimeChange(e) {
    this.endTime = e.target.value;
    if (this.endTime >= this.startTime) {
      var ms = moment(this.endTime, "HH:mm").diff(moment(this.startTime, "HH:mm"));
      var d = moment.duration(ms);
      this.Duration = Math.floor(d.asHours()) + moment.utc(ms).format(":mm");
      // console.log("correct", this.Duration);
    } else {
      this.toastService.toast("End time should be greater than start time, , Select another time");
      // console.log("wrong");
    }
  }

  substartTimeChange(e) {
    // console.log("start time", e.target.value);
    this.startTime = e.target.value;
    this.end_Time_picker = false;
    if (this.endTime >= this.startTime) {
      var ms = moment(this.endTime, "HH:mm").diff(moment(this.startTime, "HH:mm"));
      var d = moment.duration(ms);
      this.Duration = Math.floor(d.asHours()) + moment.utc(ms).format(":mm");
      // console.log("change duration", this.Duration);
    } else {
      if (this.endTime <= this.startTime) {
        this.toastService.toast("End time should be greater than start time");
        // console.log("time not match");
      }
    }
    // console.log("chesk start time and end time", this.startTime, this.endTime);
  }

  subendTimeChange(e, activity) {
    this.endTime = e.target.value;
    if (this.endTime >= this.startTime) {
      var ms = moment(this.endTime, "HH:mm").diff(moment(this.startTime, "HH:mm"));
      var d = moment.duration(ms);
      let duration = Math.floor(d.asHours()) + moment.utc(ms).format(":mm");
      activity.controls['subDuration'].setValue(duration);
      // console.log("correct", this.Duration);
    } else {
      this.toastService.toast("End time should be greater than start time, , Select another time");
      // console.log("wrong");
    }
  }

  searchData() {
    var result = this.filterData.filter(a => {
      var data = a.date;
      return data;
    });
    if (result.length > 0) {
      this.filterData = result;
      // console.log("data is comeing", this.filterData)
    } else {
      this.filterData = this.filterData;
    }
  }

  AddDsrActivity() {
    // this.userData = this.authanticationSer.getSession('authData');
    const get = this.authanticationSer.getSession('authData');
    this.userData = JSON.parse(atob(get));


    this.userFlag = this.userData.flag;
    this.authTl = this.userData.ReportingManager1Empcode;
    this.ExecutiveName = this.userData.EmpName;
    this.userEmpCode = this.userData.EmpCode;
    this.userZone = this.userData.zone;
    // console.log("authData", this.userData);

    this.drsFrom.get('executive').setValue(this.ExecutiveName);
    this.drsFrom.get('team_Leader').setValue(this.authTl);
    this.drsFrom.get('auth_role').setValue(this.userFlag);
    this.drsFrom.get('userName').setValue(this.userEmpCode);
    this.drsFrom.get('zone').setValue(this.userZone);

    this.PremiumFooter = false;
    this.dsrActivityAdd = true;
    this.dsrDetails = !this.dsrDetails;
    this.openFilter = false;
    this.searchBar = false;
    this.emptyRecord = !this.emptyRecord;
  }
  closeAddActivity() {
    this.dsrDetails = true;
    this.dsrActivityAdd = false;
    this.PremiumFooter = this.PremiumFooter == true ? false : true;
  }


  onSubmit() {
    if (this.drsFrom.invalid) {
      this.toastService.toast("Please check mandatory fields and can not use special character & symbols");
    }
    this.submitted = true;
    let obj = this.drsFrom.value;
    obj.bank_Name = obj.bank_Name?.bank_Name;
    obj.bank_Branch_Name = obj.bank_Branch_Name?.bank_Branch_Name;
    console.log("add data",obj);
    if (this.drsFrom.valid) {
      this.commonService.post('addDSRdtls', obj).subscribe(res => {
        this.getTotalPremium();
        this.toastService.toast("DSR activity data has been saved successfully !");
        this.drsFrom.reset();
        this.dsrActivityAdd = false;
        this.dsrDetails = true;
        this.openFilter = false;
        this.PremiumFooter = this.PremiumFooter == true ? false : true;
        this.getDSRActivityData();
      })
    }
  }

  getTotalPremium() {

    // { "userName": this.userEmpCode }
    this.commonService.post('getTotalPremium', { '': '' }).subscribe((res) => {
      if (res.ResponseFlag == 1) {
        this.totalPremium = JSON.parse(res.ResponseMessage).Table[0].TotalPremium;
        // this.totalPremium = JSON.parse(res.ResponseMessage).Table[0];
      } else {
        // console.log("Total Premium not found");
      }
    }), (err) => {
      // console.log("error", err);
    }
  }

  filterSubmit() {
    this.submitted = true;
    var data = this.filterForm.value;
    var startDate = data.startDate;
    var endDate = data.endDate;
    var result = this.filterData.filter(a => {
      var date = a.date_Of_Visit;
      return (date >= startDate && date <= endDate);
    });
    if (result.length > 0) {
      this.filterData = result;
    } else {
      this.filterData = this.filterData;
    }
  }

  minMaxDate() {
    var date = new Date();
    var datestrings = (date.getFullYear()) + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + date.getDate()).slice(-2);
    this.maxDate = datestrings;
    var tempDate = new Date(date.setDate(date.getDate() - 1));
    var minDateString = (tempDate.getFullYear()) + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + tempDate.getDate()).slice(-2);
    this.minDate = minDateString;
  }
  clearFilterForm() {
    this.filterForm.reset();
    this.getDSRActivityData();
    this.getBanks();
    this.getZones();
  }
  clearManagerFilter() {
    this.managerForm.reset();
    this.getUserName();
    this.getDSRActivityData();
    this.getZones();
  }

  filterClose() {
    this.openFilter = false;
    this.PremiumFooter = this.PremiumFooter == true ? false : true;
  }

  filterOpen() {
    this.searchBar = false;
    this.openFilter = !this.openFilter;
    this.PremiumFooter = this.PremiumFooter == true ? false : false;
    this.dsrDetails = true;
    this.dsrActivityAdd = false;
    if (this.userFlag <= 1) {
      this.segmentValue = "zone";
      // console.log("zone here");
    }
    else {
      this.segmentValue = "manager";
      // console.log("manager here");
    }
    this.getZones();
  }

  getZones() {
    let loadingParams = { msg: 'Please Wait...', spinner: 'lines-sharp-small', mode: 'ios', class: 'custom-loading', backdropDismiss: true }
    // this.loderService.showLoading(loadingParams);
    this.commonService.post('getDSRZone', { userName: this.userEmpCode }).subscribe((res) => {
      if (res.ResponseFlag == 1) {
        // this.loderService.dismiss();
        this.zoneData = JSON.parse(res.ResponseMessage).Table;
      } else {
        // this.loderService.dismiss();
        this.toastService.toast("Zone Not Found");
      }
    })
  }

  excelExport(tblId: any) {
    let d = this.excelexportService.exportExcel(tblId, 'DSR-Activity');
    // console.log("xl", d);
  }

  segmentChanged(e) {
    this.segmentValue = e.target.value;
  }
  searchIcon() {
    this.dsrActivityAdd = false;
    this.dsrDetails = true;
    this.searchBar = !this.searchBar;
    this.openFilter = false;
    this.PremiumFooter = false;
  }

  checkSpaicelChar(event: any) {
    var format = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    if (format.test(event.target.value) == true) {
      let controlName = event.srcElement.attributes.formcontrolname.nodeValue;
      this.drsFrom.get(`${controlName}`).setValidators([Validators.required]);
      this.toastService.toast('can not use special character & symbols');
      return true
    } else {
      return false
    }
  }


  
  backButton() {
    history.back();
  }
}
