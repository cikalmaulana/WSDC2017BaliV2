import { Component, OnInit,ViewEncapsulation  } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-info',
  templateUrl: './info.page.html',
  styleUrls: ['./info.page.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class InfoPage implements OnInit {
  infos: any;

  constructor(private http: HttpClient,private storage: Storage) { }

  ngOnInit() {
    this.storage.get('wsdcDataStorage').then((data) => {
      this.infos = data.info;
      this.infos = this.infos.replace(new RegExp('icon-telephone','g'), '<img src="assets/icon/telephone.png" alt="Telephone Icon" class="icon"/>');
    })
  }

}
