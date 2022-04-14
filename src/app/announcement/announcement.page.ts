import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-announcement',
  templateUrl: './announcement.page.html',
  styleUrls: ['./announcement.page.scss'],
})
export class AnnouncementPage implements OnInit {
  wsdcDataAnnouncement: any;

  constructor(private http: HttpClient,private storage: Storage) { }

  ngOnInit(): void {
    this.getDataFromStorage();
  }

  getDataFromStorage(){
    this.storage.get('wsdcDataStorage').then((data) => {
      console.log("Masuk Announcement");
      this.wsdcDataAnnouncement = data.announcements;
    })
  }

  doRefresh(event) {
    console.log('Begin async operation');

    this.http.get('https://wsdc.dnartworks.com/wsdc_data.json').subscribe((data: any) => {
      console.log("Get latest data from server");
      
      this.wsdcDataAnnouncement = data.announcements;
      this.storage.set('wsdcDataStorage',data);
      console.log("Data updated!");
      
      console.log(this.wsdcDataAnnouncement);
      
    });
    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 2000);
  }

  formatDatetime(sqlDatetime: string) {
    var date = new Date(sqlDatetime.substring(0, 10));
    var dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var dayOfWeek = date.getDay();
    var day = date.getDate();
    var monthIndex = date.getMonth();
    return sqlDatetime.substring(11, 5) + ' | ' + dayNames[dayOfWeek] + ', ' + day + ' ' + monthNames[monthIndex];
  }
}
