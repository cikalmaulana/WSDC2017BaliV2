import { Component, ElementRef} from '@angular/core';
import { ViewChild } from '@angular/core';
import { IonSlides } from '@ionic/angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.page.html',
  styleUrls: ['./schedule.page.scss'],
})
export class SchedulePage{
  @ViewChild('scheduleSlider', { static: false }) slider: IonSlides;
  @ViewChild('segmentContainer', { static: false }) segmentContainer: ElementRef;
  schedules: any;
  slideOpts = {
    initialSlide: 0,
    speed: 400,
  };
  selectedSegmentIdx: any;
  currentIndex:any;

  constructor(private storage: Storage) {
    
    this.storage.get('wsdcDataStorage').then((val) => {
      this.schedules = val.schedules;
      this.selectedSegmentIdx = 0;
    });
  }

  getDayName(sqlDate: string) {
    var date = new Date(sqlDate);
    var dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    var dayOfWeek = date.getDay();
    return dayNames[dayOfWeek];
  }

  getDate(sqlDate: string) {
    var date = new Date(sqlDate);
    return date.getDate();
  }

  onSlideChanged() {
    this.slider.getActiveIndex().then((index: number) => {
      this.currentIndex = index;
      document.getElementById(this.currentIndex).scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center'
      });
      this.selectedSegmentIdx = index;
    });
  }

  onSegmentChanged(segmentButton) {
    this.slider.slideTo(segmentButton.detail.value);
  }
}
