import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-announcement',
  templateUrl: './announcement.page.html',
  styleUrls: ['./announcement.page.scss'],
})

export class AnnouncementPage implements OnInit {
  wsdcDataAnnouncement: Array<{ localtime: string, message: string }>;

  constructor(private http: HttpClient,private storage: Storage,public toastController: ToastController) { }

  ngOnInit(): void {
    this.getDataFromStorage();
  }

  getDataFromStorage(){
    this.storage.get('wsdcDataStorage').then((data) => {
      this.wsdcDataAnnouncement = data.announcements;
    })
  }

  doRefresh(event) {
    console.log('Begin async operation');

    this.http.get('https://wsdc.dnartworks.com/wsdc_data.json').subscribe((data: any) => {
      this.storage.clear();
      this.storage.set('wsdcDataStorage',data);
      this.wsdcDataAnnouncement = data.announcements;
      console.log("Data updated!"); 
    },
    error => {
      this.presentToast();
      event.complete();
      console.log('error in HTTPRequest JSON');
    });
    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 2000);
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Failed to refresh information',
      duration: 3000
    });
    toast.present();
  }

  formatDatetime(sqlDatetime: string) {
    // Note custom function is preferred over libraries, that contains many unnecessary codes.
    var date = new Date(sqlDatetime.substring(0, 10));
    var dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var dayOfWeek = date.getDay();
    var day = date.getDate();
    var monthIndex = date.getMonth();
    console.log(sqlDatetime);
    var time=sqlDatetime.substring(16,4)
    console.log(time.substring(7));
    
    return time.substring(7) + ' | ' + dayNames[dayOfWeek] + ', ' + day + ' ' + monthNames[monthIndex];
  }
}
