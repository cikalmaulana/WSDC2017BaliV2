import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-result',
  templateUrl: './result.page.html',
  styleUrls: ['./result.page.scss'],
})
export class ResultPage implements OnInit {
  @ViewChild('resultIFrame') resultIFrame: ElementRef;

  constructor(private http: HttpClient,private storage: Storage) { }

  ngOnInit() {
    this.storage.get('wsdcDataStorage').then((data) => {
      this.resultIFrame.nativeElement.contentWindow.location.assign(data.results);
    })
  }

  onResultIframeLoad(){
    let doc = this.resultIFrame.nativeElement.contentWindow.document;
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
    this.resultIFrame.nativeElement.style.display = 'block';
  }

}
