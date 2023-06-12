import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-custom-popup',
  templateUrl: './custom-popup.component.html',
  styleUrls: ['./custom-popup.component.scss']
})
export class CustomPopupComponent implements OnInit {
  @Input() popuptype = "";
  @Input() eapprovalNo = "";
  @Input() winNo = "";
  @Output("parentFun") parentFun: EventEmitter<any> = new EventEmitter();
  @Output("closePopup") closePopup: EventEmitter<any> = new EventEmitter();
  @Output("dismissPopup") dismissPopup: EventEmitter<any> = new EventEmitter();
  constructor() { }

  ngOnInit(): void {
  }

  update() {
    this.parentFun.emit();
  }

  dismiss() {
    this.dismissPopup.emit();
  }

  close() {
    this.closePopup.emit();
  }

}
