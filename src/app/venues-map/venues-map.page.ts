import { Component, OnInit,ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { CapacitorGoogleMaps } from '@capacitor-community/capacitor-googlemaps-native';

declare var google: any;

@Component({
  selector: 'app-venues-map',
  templateUrl: './venues-map.page.html',
  styleUrls: ['./venues-map.page.scss'],
})
export class VenuesMapPage implements OnInit {
  venuesPage: any;
  venuesMaps: any;
  venuesMapsDetail: any;
  filterVenue: any;
  map: any;
  coordinates: any;
  @ViewChild('map') mapView: ElementRef;
  // @ViewChild('map', {read:ElementRef, static: false}) mapRef: ElementRef;
  constructor(private http: HttpClient, private actovatedRoute: ActivatedRoute, private router: Router,private storage: Storage) {
    // Ambil param yang dikirim dari venues.ts
    // 'var' ada di app-routing.module.ts
    this.venuesPage = this.actovatedRoute.snapshot.paramMap.get('var')
    this.storage.get('wsdcDataStorage').then((data) => {
      console.log("Masuk Venues Map");
      this.venuesMaps = data.venues;
      this.venuesMapsDetail = this.venuesMaps.filter(d=> d.id==this.venuesPage);
    })
  }

  ngOnInit() {
  }

  async loadMap(lat, long){
    

    const boundingRect = this.mapView.nativeElement.getBoundingClientRect() as DOMRect;

    CapacitorGoogleMaps.create({
      width: Math.round(boundingRect.width),
      height: Math.round(boundingRect.height),
      x: Math.round(boundingRect.x),
      y: Math.round(boundingRect.y),
      latitude: -8.409518, //lat bali
      longitude: 115.188919, //long bali
      zoom: 10
    });
    
      
      for(let venue of this.venuesMaps){
        if(this.venuesPage == venue.id){
          for(let venuesMarker of venue.geojson.features){
            const koor = venuesMarker.geometry.coordinates;
              CapacitorGoogleMaps.addListener("onMapReady", async function() {

                /*
                  We can do all the magic here when map is ready
                */
                  
                    CapacitorGoogleMaps.addMarker({
                      latitude: koor[1],
                      longitude: koor[0],
                      title: venuesMarker.properties.Name
                    });

                    CapacitorGoogleMaps.enableCurrentLocation({
                      enabled:true
                    });

                    CapacitorGoogleMaps.setMapType({
                      "type": "normal"
                    })  
                    
                })
          }
        }
      }
  }

  async ionViewDidEnter() {
    this.loadMap(-8.409518,115.188919); //Bali latitude and longitude
  }

  ionViewDidLeave() {
    CapacitorGoogleMaps.addListener("onMapReady", async function() {
      CapacitorGoogleMaps.clear();
    })
    CapacitorGoogleMaps.close();
  }

  check(id) {
    if (this.venuesPage == id) {
      return true;
    }
  }

  backToVenue() {
    CapacitorGoogleMaps.addListener("onMapReady", async function() {
      CapacitorGoogleMaps.clear();
    })
    CapacitorGoogleMaps.close();
    this.router.navigate(['venues']);
  }

  // Method untuk menset latitude dan longitude dari suatu tempat
  async setMapDetail(coordinates){
    this.coordinates = coordinates;
    console.log(this.coordinates[0] + ' ' + this.coordinates[1]);
    
    CapacitorGoogleMaps.setCamera({
      latitude: this.coordinates[1],
      longitude: this.coordinates[0],
      zoom: 15,
      animate: true,
      animationDuration: 12
    })

    CapacitorGoogleMaps.setMapType({
      "type": "normal"
    })
  }
}
