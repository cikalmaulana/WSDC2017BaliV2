import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-venues',
  templateUrl: './venues.page.html',
  styleUrls: ['./venues.page.scss'],
})
export class VenuesPage implements OnInit {
  wsdcData: any;
  constructor(private http: HttpClient, private router: Router,private storage: Storage) {
    this.storage.get('wsdcDataStorage').then((data) => {
      console.log("Masuk Venues");
      this.wsdcData = data.venues;
    })
  }

  ngOnInit() {
  }

  itemTapped(id) {
    this.router.navigate(['venues-map', id])
  }
}
