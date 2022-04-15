import { Component, OnInit,ElementRef} from '@angular/core';
import { ViewChild } from '@angular/core';
import { IonSlides } from '@ionic/angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.page.html',
  styleUrls: ['./schedule.page.scss'],
})
export class SchedulePage implements OnInit {
  @ViewChild('slides', { static: false }) slides: IonSlides;
  @ViewChild('segmentContainer', { static: false }) segmentContainer: ElementRef;
  wsdcData: any;
  slideOpts = {
    initialSlide: 0,
    speed: 400,
  };
  selectedSegmentIdx: any;
  currentIndex:any;

  constructor(private storage: Storage) {
    this.selectedSegmentIdx = 0;
  }

  ngOnInit() {
    this.storage.get('wsdcDataStorage').then((data) => {
      console.log("Masuk Schedule");
      this.wsdcData = data.schedules;
    })
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

  slideChanged() {
    this.slides.getActiveIndex().then((index: number) => {
      this.currentIndex = index;
      console.log(index);
      this.changeSegment(index);
    });
  }

  changeSegment(index){
    document.getElementById(index).scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'center'
    });
    this.selectedSegmentIdx = index;
  }

  onSegmentChanged(segmentButton) {
    this.slides.slideTo(segmentButton.detail.value);
  }
}
