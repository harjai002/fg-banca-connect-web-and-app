import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CheckboxCustomEvent } from '@ionic/angular';
@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss'],
})
export class DropdownComponent implements OnInit {
  name: string;

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {

  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    return this.modalCtrl.dismiss(this.name, 'confirm');
  }

  onTermsChanged(event: Event) {
    const ev = event as CheckboxCustomEvent;
    this.name = ev.detail.value;
    console.log(ev);
    return this.modalCtrl.dismiss(this.name, 'confirm');
  }

  data = [
    { name: 'manoj', id: 1 },
    { name: 'amit', id: 2 },
    { name: 'sumit', id: 3 },
    { name: 'joni', id: 4 },
    { name: 'rahul', id: 5 },
  ]

}

