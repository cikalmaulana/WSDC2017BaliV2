import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-announcement',
  templateUrl: './announcement.page.html',
  styleUrls: ['./announcement.page.scss'],
})
export class AnnouncementPage implements OnInit {
  announcements: any;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.http.get('./assets/json/wsdc_data.json').subscribe((data: any) => {
      this.announcements = data;
    });
  }

  doRefresh(event) {
    console.log('Begin async operation');

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
