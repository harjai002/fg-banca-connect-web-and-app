import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})

export class LoderService {
  public loading: HTMLIonLoadingElement;
  public loaderStatus: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)


  constructor(private loadingCtrl: LoadingController) { }

  async showLoading(params: any = {}) {
    const loading = await this.loadingCtrl.create({
      message: params.msg ? params.msg : 'Please Wait...',
      spinner: params.spinner ? params.spinner : 'circles',
      mode: params.mode ? params.mode : 'ios',
      cssClass: params.class ? params.class : 'custom-loading',
      backdropDismiss: params.backdropDismiss ? params.backdropDismiss : false,
    });
    loading.present();
  }

  dismiss() {
    this.dismissed();
    // this.loadingCtrl.dismiss().then(a => console.log('dismissed'));
  }

  // async dismissed() {
  //   return await this.loadingCtrl.dismiss().then(() => console.log('loader dismissed'));
  // }

  async dismissed() {
    let topLoader = await this.loadingCtrl.getTop();
    while (topLoader) {
      if (!(await topLoader.dismiss())) {
        throw new Error('Loader is dismiss');
      }
      topLoader = await this.loadingCtrl.getTop();
    }
  }
}