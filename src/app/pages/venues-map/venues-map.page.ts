import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-venues-map',
  templateUrl: './venues-map.page.html',
  styleUrls: ['./venues-map.page.scss'],
})
export class VenuesMapPage implements OnInit {
  venuesPage: any;
  venuesMaps: any;
  filterVenue: any;
  constructor(private http: HttpClient, private actovatedRoute: ActivatedRoute) {
    // this.actovatedRoute.paramMap.subscribe(
    //   (data) => {
    //     this.venuesPage = data;
    //   }
    // )

    this.venuesPage = this.actovatedRoute.snapshot.paramMap.get('var')
    this.http.get('./assets/json/venues.json').subscribe((data: any) => {
      this.venuesMaps = data;
    });
    this.memfilter();
  }

  ngOnInit() {
  }

  check(id) {
    if (this.venuesPage == id) {
      return true;
    }
  }

  memfilter() {
    this.filterVenue = this.venuesMaps;
    // this.filterVenue = this.venuesMaps.filter(this.venuesMaps.id == this.venuesPage);
  }

}
