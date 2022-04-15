import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-venues',
  templateUrl: './venues.page.html',
  styleUrls: ['./venues.page.scss'],
})
export class VenuesPage implements OnInit {
  venuesData: Array<{ id: string, name: string, icon: string, geojson: any, colorIdx: number }>;
  valVenues: any;
  constructor(private router: Router,private storage: Storage) {
    this.storage.get('wsdcDataStorage').then((val) => {
      this.valVenues = val.venues;
      this.venuesData = [];
      let currColorIdx: number = 1;
      for (let venue of this.valVenues) {
        this.venuesData.push({
          id: venue.id,
          name: venue.name,
          icon: venue.icon,
          geojson: venue.geojson,
          colorIdx: currColorIdx,
        });
        if (currColorIdx > 4) {
          currColorIdx = 1;
        } else {
          currColorIdx++;
        }
      }
    })
  }

  ngOnInit() {
  }

  itemTapped(wsdcVenue) {
    // this.router.navigate(['venues-map', id])
    let navigationExtras: NavigationExtras = {
      state: {
        venuesData: wsdcVenue
      }
    };
    this.router.navigate(['venues-map'], navigationExtras);
  }
}
