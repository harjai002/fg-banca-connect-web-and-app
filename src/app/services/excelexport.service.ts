import { Injectable, NgZone } from '@angular/core';
import * as XLSX from 'xlsx';
import * as moment from 'moment';
// for file download apk 
import { File } from '@ionic-native/file/ngx';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';

@Injectable({
  providedIn: 'root'
})
export class ExcelexportService {
  progress: number;

  constructor(
    private file: File,
    private fileTransfer: FileTransfer,
    private androidPermissions: AndroidPermissions,
    public _zone: NgZone,
  ) { }

  exportExcel(tableId: any, fileName: any): void {
    /* pass here the table id */
    let element = document.getElementById(tableId);
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    const d = XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    console.log("ws", wb);
    /* save to file */
    var date = new Date();
    var format = moment(date).format('DD-MM-YYYY');
    var url =XLSX.writeFile(wb, format + "-" + fileName + '.xlsx');
    // this.downloadApp(url);
    console.log("url",url);
  }


  downloadApp(url:any) {
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
    // this.url = "https://tinyurl.com/INSTABv2";
    // var path = this.file.externalRootDirectory + '/Download/';
    var path = this.file.applicationDirectory;
    fileTransfer.download(url, path + "sample.xlsx").then((data) => {
      // ApkUpdater.install( success, failure);
      console.log('Download complete.');  //handle success Manoj_ 
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

}
