import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class CommonService {
  headers = { 'content-type': 'application/json' }
  public api: any;
  constructor(private http: HttpClient) {
    
    if (window.location.hostname == 'localhost') {
      this.api = environment.baseUrl;
    } else {
      this.api = location.protocol + "//" + location.hostname + "/TeamTrack/api";
      // this.api = location.protocol + "//" + location.hostname + "/DSR/";
    }
  }

  get(method: any): Observable<any> {
    return this.http.get(this.api + `/MobileApp/${method}`, { 'headers': this.headers });
  }

  post(method: any, obj: any): Observable<any> {
    return this.http.post(this.api + `/MobileApp/${method}`, obj, { 'headers': this.headers });
  }

  // getLeadersData(obj:any): Observable<any> {
  //   return this.http.post(this.api + '/MobileApp/getDSRleaders', obj);
  // }

  // getAll(obj:any): Observable<any> {
  //   return this.http.post(this.api + '/MobileApp/getDSRdtls', obj);
  // }

  // getPremium(obj:any): Observable<any> {
  //   return this.http.post(this.api + '/MobileApp/getTotalPremium', obj,{'headers':this.headers});
  // }

  // createDsrActivity(obj:any): Observable<any> {
  //   return this.http.post(this.api + '/MobileApp/addDSRdtls', obj);
  // }

  // getTeamsActivity(obj:any): Observable<any> {
  //   return this.http.post(this.api + '/MobileApp/getDSRIndivisualCounts', obj);
  // }

  // getZone(obj:any): Observable<any> {
  //   return this.http.post(this.api + '/MobileApp/getDSRZone', obj);
  // }

  getDsrWithZone(obj: any): Observable<any> {
    const header = { 'content-type': 'application/json' }
    return this.http.post(this.api + '/MobileApp/getDSRWithZone', obj, { 'headers': header });
  }
  // getYesturdayData(obj:any): Observable<any> {
  //   const header ={'content-type':'application/json'}
  //   return this.http.post(this.api + '/MobileApp/getDSRlastday', obj ,{'headers':header});
  // }
  // getMonthData(obj:any): Observable<any> {
  //   const header ={'content-type':'application/json'}
  //   return this.http.post(this.api + '/MobileApp/getDSRlastMonth', obj ,{'headers':header});
  // }

  getReportData(obj: any): Observable<any> {
    const header = { 'content-type': 'application/json' }
    return this.http.post(this.api + '/MobileApp/getDSRDtls', obj, { 'headers': header });
  }

}
