import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  @Input() serchPlaceholder: string;
  @Output() searchValue = new EventEmitter<any>();
  d = "manoj kumar here";
  name:any;
  constructor() {
  }

  ngOnInit() {
    console.log("test", this.serchPlaceholder);
  }

  changeSearch() {
    // this.searchValue.emit(this.CopyText);
    console.log("child val",this.name);
  }


}
