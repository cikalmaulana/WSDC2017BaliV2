import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-announcement',
  templateUrl: './announcement.page.html',
  styleUrls: ['./announcement.page.scss'],
})
export class AnnouncementPage implements OnInit {
  wsdcData: any;
  wsdcDataAnnouncement: any;

  constructor(private http: HttpClient,private storage: Storage) { }

  ngOnInit(): void {
    // this.http.get('https://wsdc.dnartworks.com/wsdc_data.json').subscribe((data: any) => {
    //   this.wsdcData = data.announcements;
    // });

    this.getDataFromStorage();
  }

  getDataFromStorage(){
    // From storage
    this.storage.get('wsdcDataStorage').then((data) => {
      console.log("Masuk Announcement");
      this.wsdcDataAnnouncement = data.announcements;
    })

    // From server : 
    // this.http.get('https://wsdc.dnartworks.com/wsdc_data.json').subscribe((data: any) => {
    //   console.log("Get latest data from server");
      
    //   this.wsdcDataAnnouncement = data.announcements;
    //   console.log("Data updated!");
      
    //   console.log(this.wsdcDataAnnouncement);
      
    // });
  }

  doRefresh(event) {
    console.log('Begin async operation');

    this.getDataFromStorage();

    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 2000);
  }

  formatDatetime(sqlDatetime: string) {
    var date = new Date(sqlDatetime.substr(0, 10));
    var dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var dayOfWeek = date.getDay();
    var day = date.getDate();
    var monthIndex = date.getMonth();
    return sqlDatetime.substr(11, 5) + ' | ' + dayNames[dayOfWeek] + ', ' + day + ' ' + monthNames[monthIndex];
  }
}
