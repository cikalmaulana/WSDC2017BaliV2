import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-info',
  templateUrl: './info.page.html',
  styleUrls: ['./info.page.scss'],
})
export class InfoPage implements OnInit {
  infos: any;

  constructor(private http: HttpClient,private storage: Storage) { }

  ngOnInit() {
    // this.http.get('https://wsdc.dnartworks.com/wsdc_data.json').subscribe((data: any) => {
    //   this.infos = data.info;
    // });
    this.storage.get('wsdcDataStorage').then((data) => {
      console.log("MasukInfo");
      this.infos = data.info;
    })
  }

}
