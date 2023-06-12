import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(public toastController: ToastController) { }

  async toast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 3000,
      cssClass:"toast_style",
      mode:'ios'
    });
    toast.present();
  }
}
