import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {



  constructor(public router: Router) { }

  // session storage start here 
  setSession(key: string, data: any) {
    sessionStorage.setItem(key, JSON.stringify(data));
  }

  getSession(key: string) {
    if (sessionStorage.authData) {
      // const get=sessionStorage.getItem('authData');
      // const objStr = atob(get)
      // console.log("decode data", objStr)
      // const obj = JSON.parse( atob(get));
      // console.log("parse data",obj)
      return JSON.parse(sessionStorage.getItem(key));
    } else {
      this.router.navigate(['/home']);
      console.log("Auth Data Not Found");
    }
  }

  removeSession(key: string) {
    sessionStorage.removeItem(key);
  }

  clearSession() {
    sessionStorage.clear();
  }



  // local storage start here 
  setLocal(key: string, data: any) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  getLocal(key: string) {
    localStorage.getItem(key);
  }

  removeLocal(key: string) {
    localStorage.removeItem(key);
  }

  clearLocal() {
    localStorage.clear();
  }

}
