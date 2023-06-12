import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public api: any;
  constructor(private http: HttpClient) {
    this.api = environment.baseUrl;
  }

  login(obj: any): Observable<any> {
    // return this.http.post(this.api + '/MobileApp/DSRLogin',obj);
    return this.http.post(this.api + '/Login/Authenticate', obj);
  }

  getReportingManager(obj: any): Observable<any> {
    return this.http.post(this.api + '/Common/getEmp', obj);
  }

  getToken() {
    if (sessionStorage.Token) {
      return sessionStorage.getItem("Token").replace(/['"]/g, '');
    } else {

    }

  }

}