import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../auth/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private authanticationSer: AuthenticationService) { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // if(sessionStorage.getItem('authData')){
    //   return true;
    // }
    // else{
    //   this.router.navigateByUrl('/');
    // }
    let d = this.authanticationSer.getSession('authData')
    if (d) {
      return true;
    }
    else {
      this.router.navigateByUrl('/login');
    }
  }

}
