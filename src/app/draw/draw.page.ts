import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-draw',
  templateUrl: './draw.page.html',
  styleUrls: ['./draw.page.scss'],
})
export class DrawPage implements OnInit {
  @ViewChild('drawIFrame') drawIFrame: ElementRef;

  constructor(private http: HttpClient,private storage: Storage) { }

  ngOnInit() {
    // this.http.get('https://wsdc.dnartworks.com/wsdc_data.json').subscribe((data: any) => {
    //   this.drawIFrame.nativeElement.contentWindow.location.assign(data.draws);
    // });

    this.storage.get('wsdcDataStorage').then((data) => {
      console.log("Masuk Draw");
      this.drawIFrame.nativeElement.contentWindow.location.assign(data.draws);
    })
  }

  drawFrameLoad(){
    let doc = this.drawIFrame.nativeElement.contentWindow.document;
    let elements = [
      doc.getElementById('header'),
      doc.getElementById('page_header'),
      doc.getElementById('footer')
    ];
    elements.forEach(function (element) {
      if (element) {
        element.style.display = 'none';
      }
    })
    this.drawIFrame.nativeElement.style.display = 'block';
  }
}