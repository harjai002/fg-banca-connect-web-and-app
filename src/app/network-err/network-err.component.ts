import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { LoderService } from '../services/components/loder.service';
import { NetworkCheckService } from '../services/network-check.service'
@Component({
  selector: 'app-network-err',
  templateUrl: './network-err.component.html',
  styleUrls: ['./network-err.component.scss'],
})
export class NetworkErrComponent implements OnInit {

  constructor(private menuCtrl: MenuController,
    private loderService: LoderService,
    private NetworkCheckService: NetworkCheckService) {

  }

  ngOnInit() {
    this.loderService.dismiss();
    this.menuCtrl.enable(false);
  }

  exitApp() {
    this.NetworkCheckService.ngOnInit();
    // navigator['app'].exitApp();
  }

}
