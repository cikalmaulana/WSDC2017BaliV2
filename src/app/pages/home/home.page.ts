import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// npm install @capacitor/browser
import { Browser } from '@capacitor/browser';

//npm i @ionic/storage-angular
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  announcements: any;
  announcementsHomeDate: Date;
  newsletters: any;
  wsdcDataAnnouncement: any;
  wsdcDataNewsletters: any;

  i: number;

  constructor(private http: HttpClient,private storage: Storage) { }

  ngOnInit(): void {
    // this.http.get('https://wsdc.dnartworks.com/wsdc_data.json').subscribe((data: any) => {
    //   this.announcements = data.announcements;
    //   this.newsletters = data.newsletters;
    //   this.announcementsHomeDate = data.localtime;
    // });

    this.storage.get('wsdcDataStorage').then((data) => {
      console.log("ngOnInit Storage");
      
      if(data == null){
        console.log("Masuk | Storage = null | Storage dibuat");
        this.http.get('https://wsdc.dnartworks.com/wsdc_data.json').subscribe((data: any) => {
          console.log("Masuk http");
          
          this.wsdcDataAnnouncement = data.announcements;
          this.wsdcDataNewsletters = data.newsletters;
          this.storage.set('wsdcDataStorage',data);
          console.log(this.wsdcDataAnnouncement);
          console.log(this.wsdcDataNewsletters);
          
        });
      }else{
        console.log('Masuk else | Data sudah ada di storage');
        
        this.wsdcDataAnnouncement = data.announcements;
        this.wsdcDataNewsletters = data.newsletters;
      }
      
    })
    
  }

  doRefresh(event) {
    console.log('Begin async operation');
    this.http.get('https://wsdc.dnartworks.com/wsdc_data.json').subscribe((data: any) => {
      console.log("Get latest data from server");
      
      this.wsdcDataAnnouncement = data.announcements;
      this.wsdcDataNewsletters = data.newsletters;
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
    // Note custom function is preferred over libraries, that contains many unnecessary codes.
    if (sqlDatetime === null) {
      return null;
    }
    var date = new Date(sqlDatetime.substr(0, 10));
    var dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var dayOfWeek = date.getDay();
    return dayNames[dayOfWeek] + ', ' + sqlDatetime.substr(11, 5);
  }

  getAnnouncementHome() {
    return this.announcementsHomeDate;
  }

  launch(newsUrl) {
    Browser.open({ url: newsUrl });
  }
}
