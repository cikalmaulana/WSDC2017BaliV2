import { Component, OnInit,ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { CapacitorGoogleMaps } from "@capacitor-community/google-maps";
import { Geolocation } from '@capacitor/geolocation';

@Component({
  selector: 'app-venues-map',
  templateUrl: './venues-map.page.html',
  styleUrls: ['./venues-map.page.scss'],
})
export class VenuesMapPage implements OnInit {
  venuesPage: any;
  venuesMaps: any;
  venuesMapsDetail: any;
  coordinates: any;
  mapid: any;
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

  ionViewDidEnter() {
    const initializeMap = async () => {
      await CapacitorGoogleMaps.initialize({
        key: "YOUR_IOS_MAPS_API_KEY",
        devicePixelRatio: window.devicePixelRatio,
      });
      const element = document.getElementById("container");
      const boundingRect = element.getBoundingClientRect();
      try {
        const result = await CapacitorGoogleMaps.createMap({
          boundingRect: {
            width: Math.round(boundingRect.width),
            height: Math.round(boundingRect.height),
            x: Math.round(boundingRect.x),
            y: Math.round(boundingRect.y),
          },
          cameraPosition:{
            target:{
              latitude:-8.409518,
              longitude: 115.188919
            },
            zoom:11
          }
        });
        
        element.style.background = "";
        element.setAttribute("data-maps-id", result.googleMap.mapId);
        this.mapid = result.googleMap.mapId;
        for(let venue of this.venuesMaps){
          if(this.venuesPage == venue.id){
            for(let venuesMarker of venue.geojson.features){
              const koor = venuesMarker.geometry.coordinates;     
              CapacitorGoogleMaps.addMarker({
                mapId:result.googleMap.mapId,
                position:{
                  latitude: koor[1],
                  longitude: koor[0],
                },
                preferences:{
                  title: venuesMarker.properties.Name
                },
              });     
            }
          }
        }
      } catch (e) {
        alert("Map failed to load");
      }

      
    };
    
    (function () {
      initializeMap();
    })();

  }

  backToVenue() {
    this.router.navigate(['venues']);
  }

  setMapDetail(coordinates){
    this.coordinates = coordinates;
    console.log(this.coordinates[0] + ' ' + this.coordinates[1]);

    CapacitorGoogleMaps.moveCamera({
      mapId:this.mapid,
      cameraPosition:{
        target:{
          latitude: this.coordinates[1],
          longitude: this.coordinates[0],
        },
        zoom:15
      },
      duration:600
    });     
  }
}
