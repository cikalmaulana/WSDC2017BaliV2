import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Browser } from '@capacitor/browser';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  announcements: any;
  announcementsHomeDate: Date;
  newsletters: any;

  i: number;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.http.get('https://wsdc.dnartworks.com/wsdc_data.json').subscribe((data: any) => {
      this.announcements = data.announcements;
      this.newsletters = data.newsletters;
      this.announcementsHomeDate = data.localtime;
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
