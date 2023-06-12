import { Injectable } from '@angular/core';
import { ToastService } from './components/toast.service';
import * as moment from 'moment';
@Injectable({
  providedIn: 'root'
})
export class TimeDurationService {
  startTime:any;
  endTime:any;
  Duration:any;
  constructor( public toastService: ToastService) { }

  startTimeChange(e) {
    console.log("start time service", e.target.value);
    this.startTime = e.target.value;
    // this.end_Time_picker = false;
    if (this.endTime >= this.startTime) {
      var ms = moment(this.endTime, "HH:mm").diff(moment(this.startTime, "HH:mm"));
      var d = moment.duration(ms);
      return Math.floor(d.asHours()) + moment.utc(ms).format(":mm");
      // console.log("change duration", this.Duration);
    } else {
      if (this.endTime <= this.startTime) {
        this.toastService.toast("End time should be greater than start time");
        console.log("time not match");
      }
    }
    console.log("chesk start time and end time", this.startTime, this.endTime);
  }


  endTimeChange(e) {
    this.endTime = e.target.value;
    if (this.endTime >= this.startTime) {
      var ms = moment(this.endTime, "HH:mm").diff(moment(this.startTime, "HH:mm"));
      var d = moment.duration(ms);
      this.Duration = Math.floor(d.asHours()) + moment.utc(ms).format(":mm");
      console.log("correct", this.Duration);
    } else {
      this.toastService.toast("End time should be greater than start time, , Select another time");
      console.log("wrong");
    }
  }

}
