import { Component, OnInit,ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

declare var google: any;

@Component({
  selector: 'app-venues-map',
  templateUrl: './venues-map.page.html',
  styleUrls: ['./venues-map.page.scss'],
})
export class VenuesMapPage implements OnInit {
  venuesPage: any;
  venuesMaps: any;
  filterVenue: any;
  map: any;
  coordinates: any;

  @ViewChild('map', {read:ElementRef, static: false}) mapRef: ElementRef;
  constructor(private http: HttpClient, private actovatedRoute: ActivatedRoute, private router: Router) {
    // this.actovatedRoute.paramMap.subscribe(
    //   (data) => {
    //     this.venuesPage = data;
    //   }
    // )

    this.venuesPage = this.actovatedRoute.snapshot.paramMap.get('var')
    this.http.get('https://wsdc.dnartworks.com/wsdc_data.json').subscribe((data: any) => {
      this.venuesMaps = data.venues;
    });
    this.memfilter();
  }

  ngOnInit() {
  }

  ionViewDidEnter(){
    this.showMap(-8.409518, 115.188919); //first lat long is in bali
  }

  showMap(lat, lng){ 
    const location = new google.maps.LatLng(lat,lng);
    const options = {
      center: location,
      zoom: 15,
      disableDefaultUI: true
    }
    this.map = new google.maps.Map(this.mapRef.nativeElement, options);

    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(lat,lng),
        map: this.map
    });

    new google.maps.Marker({
      position: location,
      title: "Hello World!",
    });
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

  backToVenue() {
    this.router.navigate(['venues'])
  }

  // Method untuk menset latitude dan longitude dari suatu tempat
  setMapDetail(coordinates){
    this.coordinates = coordinates;
    console.log(this.coordinates[0] + ' ' + this.coordinates[1]);
    this.showMap(this.coordinates[1],this.coordinates[0]);
  }
}
