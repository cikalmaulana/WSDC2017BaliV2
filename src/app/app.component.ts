import { Component } from '@angular/core';
import { Storage } from '@ionic/storage-angular'
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { title: 'Home', url: '/home', icon: 'home' },
    { title: 'Announcements', url: '/announcement', icon: 'megaphone' },
    { title: 'Schedule', url: '/schedule', icon: 'calendar' },
    { title: 'Venues', url: '/venues', icon: 'map' },
    { title: 'Draw', url: '/draw', icon: 'chatbox' },
    { title: 'Result', url: '/result', icon: 'newspaper' },
    { title: 'Info', url: '/info', icon: 'alert' },
  ];

  constructor(private storage: Storage) { 
    
  }

  async ngOnInit(){
    await this.storage.create();
  }

  
}
