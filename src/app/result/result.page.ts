import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Storage } from '@ionic/storage';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-result',
  templateUrl: './result.page.html',
  styleUrls: ['./result.page.scss'],
})

export class ResultPage implements OnInit {
  @ViewChild('resultIFrame') resultIFrame: ElementRef;

  constructor(private storage: Storage,public loadingController: LoadingController) { }

  ngOnInit() {
    this.storage.get('wsdcDataStorage').then((data) => {
      this.resultIFrame.nativeElement.contentWindow.location.assign(data.results);
    });
    this.presentLoading();
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Please wait...',
      backdropDismiss: true
    });

    await loading.present();

    setTimeout(() => {
      loading.dismiss();
    }, 500);
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
