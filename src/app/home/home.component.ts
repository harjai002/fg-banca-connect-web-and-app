import { Component, OnDestroy, OnInit, NgZone } from '@angular/core';
import { AuthenticationService } from '../services/auth/authentication.service';
import { SharedDataService } from '../services/shared-data.service';
// for file download apk 
import { File } from '@ionic-native/file/ngx';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import ApkUpdater, { Progress } from 'cordova-plugin-apkupdater';
import { Platform } from '@ionic/angular';
import { AppVersion } from '@awesome-cordova-plugins/app-version/ngx';
import { CommonService } from '../services/common.service';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  titleMsg = "Home Page";
  userData: any;
  userFlag: any;
  userName: any;
  userEmpCode: any;
  slideOpts = {
    initialSlide: 1,
    speed: 400,
    loop: true,
    autoplay: {
      delay: 4000,
      reverseDirection: false
    }
  };
  // for file start here 
  filename: any;
  appVersionNumber: string;
  progress: number;
  progressBar: boolean = false;
  addAccess:String;
  showError: boolean = false;


  constructor(private sharedDataService: SharedDataService,
    private authanticationSer: AuthenticationService,
    private platform: Platform,
    private commonService: CommonService,
    public router: Router,
    // for download apk file
    private file: File,
    private fileTransfer: FileTransfer,
    private androidPermissions: AndroidPermissions,
    public _zone: NgZone,
    private appVersion: AppVersion,
    public alertController: AlertController,
  ) {
    this.deviceReady();
    // setInterval(() => {
    //   this.progress += 0.01;

    //   // Reset the progress bar when it reaches 100%
    //   // to continuously show the demo
    //   if (this.progress > 1) {
    //     setTimeout(() => {
    //       this.progress = 0;
    //     }, 1000);
    //   }
    // }, 50);
  }

  ngOnInit() {
    this.getData();
  }




  onMenuOpen() {
    this.getData();
  }
  getData() {
    this.sharedDataService.data.subscribe(res => {
      this.userFlag = res.flag;
    });
    const get = this.authanticationSer.getSession('authData');
   
    this.userData = JSON.parse(atob(get));
    // console.log("get",this.userData);
    // this.userData = this.authanticationSer.getSession('authData');
    this.userEmpCode = this.userData.Empcode;
    this.userFlag = this.userData.flag;
    this.sharedDataService.sendData(this.userData);
  }



  //  auto download latest app version


  deviceReady() {
    this.platform.ready().then(() => {
      if (this.platform.is('android') || this.platform.is('ios')) {

        this.appVersion.getVersionNumber().then(response => {
          this.appVersionNumber = response;
          var version;
          this.commonService.get('getDSRAppVersion').subscribe((res) => {
            if (res.ResponseFlag == 1) {
              version = JSON.parse(res.ResponseMessage).Table;
              // console.log("api version", version);
              if (this.appVersionNumber != version[0].Version) {
                if (this.platform.is('ios')) {
                  console.log("ios version is avilable");
                } else {
                  this.appUpdateConfirm();
                }

              }
              else {
                // console.log("version is match");
              }
            } else {
              // console.log("version not found");
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
      // this.loginBtn = true;
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
            // this.loginBtn = false;
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
      // https://online.futuregenerali.in/DSR/FgBancaConnectMain.zip
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
