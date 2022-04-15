import { Component, ViewEncapsulation  } from '@angular/core';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-info',
  templateUrl: './info.page.html',
  styleUrls: ['./info.page.scss'],
  encapsulation: ViewEncapsulation.None,
})

export class InfoPage{
  wsdcInfoData: any;

  constructor(private storage: Storage) { 
    this.storage.get('wsdcDataStorage').then((data) => {
      this.wsdcInfoData = data.info;
      this.wsdcInfoData = this.wsdcInfoData.replace(new RegExp('icon-telephone','g'), '<img src="assets/icon/telephone.png" alt="Telephone Icon" class="icon"/>');
    })
  }

}
