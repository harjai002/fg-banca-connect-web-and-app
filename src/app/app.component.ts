import { Component, OnInit, ViewChild, ApplicationRef } from '@angular/core';
import { Router } from '@angular/router';
import { LocationStrategy } from '@angular/common';
import { AlertController, MenuController, ToastController } from '@ionic/angular';
import { Platform, IonRouterOutlet } from '@ionic/angular';
import { SharedDataService } from './services/shared-data.service';
import { SplashScreen } from '@awesome-cordova-plugins/splash-screen/ngx';
import { StatusBar } from '@awesome-cordova-plugins/status-bar/ngx';
import { NetworkCheckService } from './services/network-check.service';
import { AppVersion } from '@awesome-cordova-plugins/app-version/ngx';
import { AuthenticationService } from './services/auth/authentication.service';
import { CommonService } from './services/common.service';
import { LoderService } from 'src/app/services/components/loder.service';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { SwUpdate } from '@angular/service-worker';
import { interval } from 'rxjs';
import { environment } from 'src/environments/environment';
import { InAppBrowser, InAppBrowserOptions } from '@awesome-cordova-plugins/in-app-browser/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  @ViewChild(IonRouterOutlet) routerOutlet: IonRouterOutlet;
  public showusericon: any;
  public login: any;
  userName: any;
  userEmail: any;
  userRole: any;
  userFlag: any;
  appVersionNumber: string;
  public progress = 0;
  public appPages = [
    // { title: 'Home', url: 'home', icon: 'home' },
  ];
  //  pwa start here
  isOnline: boolean;
  modalVersion: boolean;
  modalPwaEvent: any;
  modalPwaPlatform: string | undefined;
  //  pwa end here 
  loaderStatus: boolean;
  newVersionAvailable: boolean = false;
  constructor(
    public menuCtrl: MenuController,
    public router: Router, public toastController: ToastController,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private sharedDataService: SharedDataService,
    public alertController: AlertController,
    private networkCheckService: NetworkCheckService,
    private appVersion: AppVersion,
    private authanticationSer: AuthenticationService,
    private commonService: CommonService,
    private loderService: LoderService,
    private androidPermissions: AndroidPermissions,
    private swUpdate: SwUpdate, // for Pwa web update,
    private applicationRef: ApplicationRef,
    private inAppBrowser: InAppBrowser
  ) {

    this.loderService.loaderStatus.subscribe(res => {
      this.loaderStatus = res;
    })

    // *************    PWA  Update start here  *************
    swUpdate.available.subscribe(event => {
      swUpdate.activateUpdate().then(() => {
        window.location.reload();
        console.log('there is an Update! Reloading now.')
      });
    })

    if (!this.swUpdate.isEnabled) {
      console.log('Not going to update');
    }
    // *************    PWA  Update start here  *************

    this.initializeApp();
  }

  ngOnInit() {
    this.getSubjectData();
    if (sessionStorage.authData) {
      const get = this.authanticationSer.getSession('authData');
      let d = JSON.parse(atob(get));
      if (d) {
        this.userName = d.EmpName;
        this.userEmail = d.Email;
        this.userFlag = d.flag;
        this.router.navigate(['/home']);
      } else {
        this.router.navigateByUrl('/login');
      }
    }

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // for check Permissions
      this.checkPermissions();

      // Check internet connection 
      this.networkCheckService.ngOnInit();

      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.statusBar.overlaysWebView(false);
      this.statusBar.backgroundColorByHexString("#c21b17")

      this.platform.backButton.subscribeWithPriority(0, () => {
        console.log('back', this.router.url);
        if (this.router.url === '/home' || this.router.url === '/login') {
          this.appExitAlertConfirm();
          // navigator['app'].exitApp();
        } else {
          this.routerOutlet.pop();
        }
      }
      );



      if (this.platform.is('android')) {
        // console.log("manoj");
        this.appVersion.getVersionNumber().then(response => {
          this.appVersionNumber = response;
          var version;
          this.commonService.get('getDSRAppVersion').subscribe((res) => {
            if (res.ResponseFlag == 1) {
              version = JSON.parse(res.ResponseMessage).Table;
              if (this.appVersionNumber != version[0].Version) {
                // this.appUpdateConfirm();
              }
              else {
                console.log("version is match");
              }
            } else {
              console.log("version not found");
            }
          }), (err) => {
            console.log("error", err);
          }
        }).catch(error => {
          alert(error);
        });
      }

    }
    );
  }

  public myStyles = { 'color': 'white', 'margin': '0rem 3rem 0rem 3rem', 'font-size': '2rem' }

  getSubjectData() {
    this.sharedDataService.data.subscribe(res => {
      this.userName = res.EmpName;
      this.userFlag = res.flag;
      this.userEmail = res.Email;
      // console.log("subject data resive", res);
    });
  }

  public close() {
    this.menuCtrl.close();
  }
  public goToHome(item): any {
    console.log(item);
    this.router.navigateByUrl(item.url);
  }

  commonLogOutData() {
    this.authanticationSer.removeSession('authData');
    this.authanticationSer.removeSession('Token');
    this.menuCtrl.enable(false);
    this.loderService.dismiss();
    this.router.navigateByUrl('/login');
  }

 
  logout() {
    this.menuCtrl.close();
    this.commonService.post('expireToken', { '': '' }).subscribe((res) => {
      if (res.ResponseFlag == 1) {
        this.commonLogOutData();
        if (this.platform.is('ios')) {
          this.openWithInAppBrowser();  
        } else {
          console.log("openWithInAppBrowser will not work on android and ios platform");
        }
      } else {
        this.commonLogOutData();
      }
    });
 
    
  }


  options: InAppBrowserOptions = {
    clearcache: 'yes',
    clearsessioncache: 'yes',
    zoom: 'yes',//Android only ,shows browser zoom controls 
    hardwareback: 'yes',
    mediaPlaybackRequiresUserAction: 'no',
    shouldPauseOnSuspend: 'no', //Android only 
    closebuttoncaption: 'Close', //iOS only
    disallowoverscroll: 'no', //iOS only 
    toolbar: 'yes', //iOS only 
    enableViewportScale: 'no', //iOS only 
    allowInlineMediaPlayback: 'no',//iOS only 
    presentationstyle: 'pagesheet',//iOS only 
    fullscreen: 'yes',//Windows only    
  };
  public openWithInAppBrowser() {
    let target = "_self";
    this.inAppBrowser.create('https://online.futuregenerali.in/TeamTrack/Web/#', target, this.options);
  }

  async appExitAlertConfirm() {
    const alert = await this.alertController.create({
      header: 'App Exit Confirm!',
      message: 'Are you sure you want to exit the app?',
      mode: 'ios',
      buttons: [{
        text: 'Cancel',
        role: 'cancel',
        cssClass: 'danger',
        handler: (blah) => { }
      }, {
        text: 'Exit App',
        handler: () => {
          this.logout();
          navigator['app'].exitApp();
        }
      }]
    });

    await alert.present();
  }

  async appUpdateConfirm() {
    const alert = await this.alertController.create({
      header: 'New version available! ',
      message: 'Please update new version ',
      mode: 'ios',
      backdropDismiss: false,
      buttons: [
        {
          text: 'Update',
          handler: () => {
            // this.authanticationSer.removeSession('authData');
            // window.location.href = "/";
          }
        }]
    });
    await alert.present();
  }


  checkPermissions() {
    this.androidPermissions.requestPermissions(
      [
        this.androidPermissions.PERMISSION.CAMERA,
        this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE,
        this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE
      ]
    );
  }

  //********************************** */

  updateClient() {
    if (!this.swUpdate.isEnabled) {
      this.newVersionAvailable = false;
      // this.snackBar.open("Service worker is not enabled !");
      return;
    }

    this.swUpdate.available.subscribe((event) => {
      console.log('current', event.current, 'available', event.available);
      this.swUpdate.activateUpdate().then(() => document.location.reload());
    })

    this.swUpdate.activated.subscribe((event) => {
      console.log('previous', event.previous, 'current', event.current);
    })
  }

  checkUpdate() {
    this.applicationRef.isStable.subscribe((isStable) => {
      if (isStable) {
        const timeInterval = interval(8 * 60 * 60 * 1000);
        //const timeInterval = interval(60000);
        timeInterval.subscribe(() => {
          this.swUpdate.checkForUpdate().then(() => console.log('checked'));
        })
      }
    });
  }

  isNewVersionAvailable() {
    if (environment.production) {
      if (!this.swUpdate.isEnabled) {
        // this.snackBar.open("Service worker is not enabled !");
        return;
      }

      this.swUpdate.available.subscribe((event) => {
        this.newVersionAvailable = true;
      })
    }
  }

}