import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-result',
  templateUrl: './result.page.html',
  styleUrls: ['./result.page.scss'],
})
export class ResultPage implements OnInit {
  @ViewChild('resultIFrame') resultIFrame: ElementRef;
  wsdc_result: any;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.http.get('https://wsdc.dnartworks.com/wsdc_data.json').subscribe((data: any) => {
      this.wsdc_result = data.result;
      this.resultIFrame.nativeElement.contentWindow.location.assign(data.results);
    });
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
