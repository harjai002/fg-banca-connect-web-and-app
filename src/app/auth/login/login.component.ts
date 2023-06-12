import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastService } from '../../services/components/toast.service';
import { LogindataService } from '../../services/logindata.service';
import { AuthService } from '../../services/auth.service';
import { MenuController, AlertController } from '@ionic/angular';
import { SharedDataService } from 'src/app/services/shared-data.service';
import { LoderService } from 'src/app/services/components/loder.service';
import { AuthenticationService } from 'src/app/services/auth/authentication.service';
import { Platform, IonRouterOutlet } from '@ionic/angular';
import { AppVersion } from '@awesome-cordova-plugins/app-version/ngx';
import { CommonService } from '../../services/common.service';
import { CookieService } from 'ngx-cookie';
// for file download apk 
import { File } from '@ionic-native/file/ngx';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import ApkUpdater, { Progress } from 'cordova-plugin-apkupdater';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  public loginForm: FormGroup;
  public buttonDisabled: boolean = true;
  public showPassword: boolean = false;
  public passwordtoggleicon = 'eye-outline';
  public latlog: any;
  public loading: any;
  localData = [];
  formData: any;
  public deviceinput: any;
  // public validimage: string =;
  public validimageusername: string = 'assets/icon/error.png';
  public validimagepwd: string = 'assets/icon/error.png';
  progress: number;
  progressBar: boolean = false;
  appVersionNumber: string;
  loginBtn: boolean = true;



  constructor(public formBuilder: FormBuilder,
    public toastService: ToastService,
    private router: Router,
    private logindataService: LogindataService,
    private authService: AuthService,
    private menuCtrl: MenuController,
    private sharedDataService: SharedDataService,
    private loderService: LoderService,
    private commonService: CommonService,
    private authanticationSer: AuthenticationService,
    private platform: Platform,
    private appVersion: AppVersion,
    public alertController: AlertController,
    private cookieService: CookieService,
    // for download apk file
    private file: File,
    private fileTransfer: FileTransfer,
    private androidPermissions: AndroidPermissions,
    public _zone: NgZone,


  ) {
    this.deviceReady();
    this.loginForm = this.formBuilder.group({
      userName: new FormControl('', [Validators.required]),
      password: new FormControl('', Validators.required),
    });
  }

  ngOnInit() {
    // this. getUserData();
    //console.log('deive', this.device.model);
    this.loginForm.get('userName').setValue('');
    this.loginForm.get('password').setValue('');
    this.togglepassword();
    this.menuCtrl.enable(false);
  }


  getCookie() {
    var cookieName = 'HelloWorld';
    var cookieValue = 'HelloWorld';
    var myDate = new Date();
    myDate.setMonth(myDate.getMonth() + 12);
    document.cookie = cookieName + "=" + cookieValue + ";expires=" + myDate
      + ";domain=.example.com;path=/";
  }

  login() {
    let loadingParams = { msg: 'Please Wait...', spinner: 'lines-sharp-small', mode: 'ios', class: 'custom-loading', backdropDismiss: true }
    // this.loderService.showLoading(loadingParams);

    this.loderService.loaderStatus.next(true);
    let formData = this.loginForm.value;
    if (this.loginForm.valid) {
      let data = { userName: btoa(formData.userName), password: btoa(formData.password) }

      this.authService.login(data).subscribe(res => {
        this.loderService.loaderStatus.next(false);
        // this.loderService.dismiss();
        if (res.ResponseFlag == 1) {
          let data = JSON.parse(res.ResponseMessage).Table[0];
          console.log("res",JSON.parse(res.ResponseMessage).Table);
          const stringifyObj = JSON.stringify(data)
          const b64Str = btoa(stringifyObj)

          this.authanticationSer.setSession('Token', data.Token);
          this.authanticationSer.setSession('authData', b64Str);

          this.router.navigate(['/home']);
          this.menuCtrl.enable(true);
          this.sharedDataService.sendData(data);
          this.toastService.toast("Login successful");
          // this.loginForm.reset();         
        }
        else {
          this.toastService.toast("Login Failed , Please Check User Name & Password");
        }
      }, (err) => {
        console.log(err);
      }
      )
    }
  }

  togglepassword() {
    if (this.passwordtoggleicon == 'eye-outline') {
      this.passwordtoggleicon = 'eye-off-outline';
      this.showPassword = false;
    } else {
      this.passwordtoggleicon = 'eye-outline';
      this.showPassword = true;
    }
  }

  deviceReady() {
    this.platform.ready().then(() => {
      if (this.platform.is('android')) {

        this.appVersion.getVersionNumber().then(response => {
          this.appVersionNumber = response;
          var version;
          this.commonService.get('getDSRAppVersion').subscribe((res) => {
            if (res.ResponseFlag == 1) {
              version = JSON.parse(res.ResponseMessage).Table;
              // console.log("api version", version);
              if (this.appVersionNumber != version[0].Version) {
                this.appUpdateConfirm();
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
    });
  }

  downloadApp() {
    this.checkPermissions();
    const fileTransfer = this.fileTransfer.create();
    fileTransfer.onProgress((progressEvent: ProgressEvent) => {
      this._zone.run(() => {
        if (progressEvent.lengthComputable) {
          let lp = progressEvent.loaded / progressEvent.total * 100;
          this.progress = Math.round(lp * 100) / 100;
        }
      });
      // console.log("progress:" + this.progress);
    });
    var url = "https://tinyurl.com/INSTABv2";
    fileTransfer.download(url, this.file.externalDataDirectory + "sample.apk").then((data) => {
      // ApkUpdater.install( success, failure);
      console.log('Download complete: ');  //handle success Manoj_ 
      this.loginBtn = true;
    }, (err) => {
      alert("Download error " + JSON.stringify(err));
    })
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
            this.loginBtn = false;
            this.progressBar = true;
            // this.downloadApp();
            this.update();
          }
        }]
    });
    await alert.present();
  }

  async update() {
    const installedVersion = (await ApkUpdater.getInstalledVersion());
    console.log("versions", installedVersion);
    await ApkUpdater.download('https://online.futuregenerali.in/DSR/FgBancaConnectMain.zip', {
      onDownloadProgress: (e) => {
        this._zone.run(() => {
          this.progress = e?.progress ?? 0;
        });
        console.log(e.progress, this.progress);
      },
      onUnzipProgress: console.log
    }, async () => {
      await ApkUpdater.install(console.log, console.error);
    }, (error) => {
      console.error(error);
    }
    )
  }


}
