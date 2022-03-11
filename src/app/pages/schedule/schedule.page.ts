import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ViewChild } from '@angular/core';
import { IonSlides } from '@ionic/angular';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.page.html',
  styleUrls: ['./schedule.page.scss'],
})
export class SchedulePage implements OnInit {
  @ViewChild('slides') slides: IonSlides;
  wsdcData: any;
  slideOpts = {
    initialSlide: 0,
    speed: 400
  };
  hariOn: number;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.http.get('https://wsdc.dnartworks.com/wsdc_data.json').subscribe((data: any) => {
      this.wsdcData = data.schedules;
    });
    this.hariOn = 0;
  }

  getDayName(sqlDate: string) {
    var date = new Date(sqlDate);
    var dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    var dayOfWeek = date.getDay();
    return dayNames[dayOfWeek];
  }

  slideChanged() {

  }

  cekHariOn(hari) {
    if (this.hariOn == hari) {
      return true;
    } else {
      return false;
    }
  }

  updateHariOn(hari) {
    this.hariOn = hari;
  }
}
