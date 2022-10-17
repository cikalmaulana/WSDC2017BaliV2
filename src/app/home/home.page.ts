import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Browser } from '@capacitor/browser';
import { Storage } from '@ionic/storage-angular';
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

  ionViewDidEnter(){ //runs when the page has fully entered and is now the active page.
    SplashScreen.hide()
  }

  ngOnInit(): void { //called after Angular has initialized all data-bound properties of a directive
    this.storage.get('wsdcDataStorage').then((data) => {
      
      if(data == null){
        //Default from asset
        this.http.get('../assets/json/wsdc_data.json').subscribe((data: any) => {
          this.wsdcData = data;
          this.storage.set('wsdcDataStorage',data);       
        },
        error => {
          this.showToast('Failed to refresh information from local storage');
        });
      }else{    
        this.wsdcData = data;
      }
      
      // Refresh data
      setTimeout(() => {
        this.http.get('https://wsdc.dnartworks.com/wsdc_data.json')
        .subscribe((data: any) => {
          this.storage.set('wsdcDataStorage', data);
          this.wsdcData = data;
        },
        error => {
          this.showToast('Failed to refresh information');
        });
      }, 1000);
    })
    
  }

  doRefresh(refresher) {
    this.http.get('https://wsdc.dnartworks.com/wsdc_data.json').subscribe((data: any) => {
      this.storage.clear();
      this.storage.set('wsdcDataStorage',data);
      this.wsdcData = data;
    },
    error => {
      // Timeout or no connection
      this.showToast('Failed to refresh information');
      refresher.complete();
    });

    setTimeout(() => {
      refresher.target.complete();
    }, 2000);
  }

  async showToast(message: string, duration: number=3000) {
    let toast = await this.toastController.create({
      message: message,
      duration: duration
    });
    toast.present();
  }

  formatDatetime(sqlDatetime: string) {
    if (sqlDatetime === null) {
      return null;
    }
    var time=sqlDatetime.substring(16,4)
    var date = new Date(sqlDatetime.substring(0, 10));
    var dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var dayOfWeek = date.getDay();
    return dayNames[dayOfWeek] + ', ' + time.substring(7);
  }

  // ionic 6 : use capacitor in app browser
  launch(newsUrl: string) {
    Browser.open({ url: newsUrl });
  }

  // ionic 6 : use ionic angular router for change page
  onAnnouncementClick() {
    this.router.navigate(['announcement']);
  }
}
