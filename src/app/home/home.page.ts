import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Browser } from '@capacitor/browser';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { SplashScreen } from '@capacitor/splash-screen';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})

export class HomePage implements OnInit {
  wsdcDataAnnouncement: any;
  wsdcDataNewsletters: any;

  constructor(private http: HttpClient,private storage: Storage,private router: Router) { }

  ionViewDidEnter(){
    SplashScreen.hide()
  }

  ngOnInit(): void {
    this.storage.get('wsdcDataStorage').then((data) => {
      
      if(data == null){
        this.http.get('https://wsdc.dnartworks.com/wsdc_data.json').subscribe((data: any) => {
          console.log("Masuk http");
          
          this.wsdcDataAnnouncement = data.announcements;
          this.wsdcDataNewsletters = data.newsletters;
          this.storage.set('wsdcDataStorage',data);
          console.log(this.wsdcDataAnnouncement);
          console.log(this.wsdcDataNewsletters);
          
        });
      }else{    
        this.wsdcDataAnnouncement = data.announcements;
        this.wsdcDataNewsletters = data.newsletters;
      }
      
    })
    
  }

  doRefresh(event) {
    console.log('Begin async operation ' + event);
    this.http.get('https://wsdc.dnartworks.com/wsdc_data.json').subscribe((data: any) => {
      console.log("Get latest data from server");
      
      this.wsdcDataAnnouncement = data.announcements;
      this.wsdcDataNewsletters = data.newsletters;
      this.storage.set('wsdcDataStorage',data);
      console.log("Data updated!");
      
      console.log(this.wsdcDataAnnouncement);
      console.log(this.wsdcDataNewsletters);
      
    });
    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 2000);
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

  itemTapped() {
    this.router.navigate(['announcement']);
  }
}
