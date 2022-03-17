import { Component, OnInit,ElementRef} from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
  // @ViewChild('slides') slides: IonSlides;
  wsdcData: any;
  slideOpts = {
    initialSlide: 0,
    speed: 400,
  };
  hariOn: any;
  activeIdx: any;
  selectedSegmentIdx: any;
  currentIndex:any;

  constructor(private http: HttpClient,private storage: Storage) {
    this.hariOn = 0;
    this.selectedSegmentIdx = 0;
  }

  ngOnInit() {
    // this.http.get('https://wsdc.dnartworks.com/wsdc_data.json').subscribe((data: any) => {
    //   this.wsdcData = data.schedules;
    // });
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

  slideChanged(slideButton) {
    // this.hariOn = this.hariOn + 1;
    // console.log(this.slides.getActiveIndex);
    this.slides.getActiveIndex().then((index: number) => {
      this.currentIndex = index;
      // let segment = this.segmentContainer.nativeElement[index];
      // segment.scrollIntoView();
      console.log(index);
      console.log(this.segmentContainer.nativeElement);
      
      
    });

    // console.log(this.currentIndex);
    
    
    // let activeIdx = this.slides.getActiveIndex();
    // this.selectedSegmentIdx = activeIdx;
  }

  onSegmentChanged(segmentButton) {
    this.slides.slideTo(segmentButton.detail.value);
    console.log(segmentButton.detail.value);
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
