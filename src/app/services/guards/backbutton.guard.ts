import { Injectable } from '@angular/core';
import {
   ActivatedRouteSnapshot,
   CanDeactivate,
   RouterStateSnapshot,
   UrlTree,
} from '@angular/router';
import {Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {BackbuttonService} from './backbutton.service';

@Injectable({
  providedIn: 'root'
})
export class BackbuttonGuard implements  CanDeactivate<unknown>  {
  constructor(private dataService: BackbuttonService) {}

   canDeactivate(
      component: unknown,
      currentRoute: ActivatedRouteSnapshot,
      currentState: RouterStateSnapshot,
      nextState?: RouterStateSnapshot
   ):
      | Observable<boolean | UrlTree>
      | Promise<boolean | UrlTree>
      | boolean
      | UrlTree {
      const destinationUrl = nextState?.url;
      return this.dataService.disableButton$.pipe(
         map((isDisabled: boolean) =>
            isDisabled ? destinationUrl !== '/first' : true
         )
      );
   }
}
