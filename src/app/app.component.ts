import { Component,OnInit } from '@angular/core';
import { Storage } from '@ionic/storage-angular'
import { SplashScreen } from '@capacitor/splash-screen';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  public appPages = [
    { title: 'Home', url: '/home', icon: 'home' },
    { title: 'Announcements', url: '/announcement', icon: 'megaphone' },
    { title: 'Schedule', url: '/schedule', icon: 'calendar' },
    { title: 'Venues', url: '/venues', icon: 'map' },
    { title: 'Draw', url: '/draw', icon: 'chatbox' },
    { title: 'Result', url: '/result', icon: 'newspaper' },
    { title: 'Info', url: '/info', icon: 'alert' },
  ];
  platform: any;

  constructor(private storage: Storage) { 
    
  }

  async ngOnInit(){
    await this.storage.create();
    SplashScreen.hide();
  }

  
}
