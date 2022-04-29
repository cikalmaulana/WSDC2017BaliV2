import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-draw',
  templateUrl: './draw.page.html',
  styleUrls: ['./draw.page.scss'],
})

export class DrawPage implements OnInit {
  @ViewChild('drawIFrame') drawIFrame: ElementRef;
  constructor(private storage: Storage,public loadingController: LoadingController) { }

  ngOnInit() {
    this.storage.get('wsdcDataStorage').then((data) => {
      this.drawIFrame.nativeElement.contentWindow.location.assign(data.draws);
    });
    this.presentLoading();
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Please wait...',
      backdropDismiss: true // If true, the loading indicator will be dismissed when the backdrop is clicked.
    });
    await loading.present();
    setTimeout(() => {
      loading.dismiss();
    }, 1000);
  }

  onDrawIframeLoad(){
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
