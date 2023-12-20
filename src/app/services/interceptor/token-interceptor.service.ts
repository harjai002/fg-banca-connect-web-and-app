import { HttpInterceptor, HttpEvent, HttpResponse, HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { Observable, throwError as observableThrowError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LoderService } from 'src/app/services/components/loder.service';
import { ToastService } from '../../services/components/toast.service';
import { MenuController } from '@ionic/angular';
@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor {

  constructor(private injector: Injector,private router: Router, 
    private loderService: LoderService,
    public toastService: ToastService,
    public menuCtrl: MenuController,
    ) { }

  intercept(req, next) {

    let authService = this.injector.get(AuthService);
    let tokenizedReq = req.clone({
      setHeaders: {
        Authorization: `${authService.getToken()}`,
      }
    })
    // return next.handle(tokenizedReq);

    return next.handle(tokenizedReq).pipe(
      catchError((err, caught) => {
        if (sessionStorage.authData) {
          if (err.status === 401) {
            this.loderService.loaderStatus.next(false);
            this.toastService.toast("Session expired or invalid");
            sessionStorage.removeItem("Token");
            sessionStorage.removeItem("authData");
            this.loderService.dismiss();
            this.router.navigate(['/login'], {
  
            });
            this.loderService.dismiss();
            this.menuCtrl.enable(false);
          }
        }

      
        return new Observable<HttpEvent<any>>();
      }));

  }



}
