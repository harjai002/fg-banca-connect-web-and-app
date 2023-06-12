import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Network } from '@awesome-cordova-plugins/network/ngx';
import { MenuController, Platform, ToastController } from '@ionic/angular';
@Injectable({
  providedIn: 'root'
})
export class NetworkCheckService {


  constructor(private network: Network, private platform: Platform,
    private menuCtrl: MenuController,
    private toastController: ToastController, private router: Router) {
  }

  ngOnInit() {
    this.network.onDisconnect().subscribe(() => {
      console.log("we are offline");
      localStorage.removeItem('checkNetwork');
      this.toast(`Please Check Your Internet Connection`);
      this.router.navigateByUrl('/networkerr');
    });

    this.network.onConnect().subscribe(() => {
      if (localStorage.checkNetwork) {
        this.menuCtrl.enable(true);
        console.log("we are online");
        this.toast(`already network in local storage  ${this.network.type}  📶`);
        this.router.navigateByUrl('/home');
      }
      else {
        localStorage.setItem('checkNetwork', JSON.stringify(this.network.type));
        setTimeout(() => {
          this.menuCtrl.enable(true);
          this.toast(`We are back online with  ${this.network.type}  📶`);
          this.router.navigateByUrl('/home');
        }, 2000)
      }

    });
  }

  async toast(msg) {
    const alert = await this.toastController.create({
      header: 'Internet Connection',
      message: msg,
      buttons: ['OK'],
      position: 'bottom',
      duration: 1000,
      animated: true,
      mode: 'ios'
    });
    await alert.present();
  }
}
