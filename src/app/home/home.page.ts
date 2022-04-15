import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Browser } from '@capacitor/browser';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { SplashScreen } from '@capacitor/splash-screen';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})

export class HomePage implements OnInit {
  wsdcData:any;

  constructor(private http: HttpClient,private storage: Storage,private router: Router,public toastController: ToastController) { }

  ionViewDidEnter(){
    SplashScreen.hide()
  }

  ngOnInit(): void {
    this.storage.get('wsdcDataStorage').then((data) => {
      
      if(data == null){
        this.http.get('https://wsdc.dnartworks.com/wsdc_data.json').subscribe((data: any) => {
          this.wsdcData = data;
          this.storage.set('wsdcDataStorage',data);       
        });
      }else{    
        this.wsdcData = data;
      }
      
    })
    
  }

  doRefresh(refresher) {
    console.log('Begin async operation ' + refresher);
    this.http.get('https://wsdc.dnartworks.com/wsdc_data.json').subscribe((data: any) => {
      this.wsdcData = data;
      this.storage.clear();
      this.storage.set('wsdcDataStorage',data);
      console.log("Data updated!");      
    },
    error => {
      // Timeout or no connection
      this.presentToast();
      refresher.complete();
    });

    setTimeout(() => {
      console.log('Async operation has ended');
      refresher.target.complete();
    }, 2000);
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Failed to refresh information',
      duration: 2000
    });
    toast.present();
  }

  formatDatetime(sqlDatetime: string) {
    if (sqlDatetime === null) {
      return null;
    }
    var date = new Date(sqlDatetime.substring(0, 10));
    var dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var dayOfWeek = date.getDay();
    return dayNames[dayOfWeek] + ', ' + sqlDatetime.substring(11, 5);
  }


  launch(newsUrl) {
    Browser.open({ url: newsUrl });
  }

  onAnnouncementClick() {
    this.router.navigate(['announcement']);
  }
}
