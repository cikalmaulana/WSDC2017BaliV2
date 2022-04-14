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
  userDistance: any;
  userCoordinatesLat: any;
  userCoordinatesLng: any;
  mapid: any;
  userDistanceTo: string[];
  arrCoordinateLat: number[];
  arrCoordinateLng: number[];
  itemCounter: any;

  constructor(private http: HttpClient, private actovatedRoute: ActivatedRoute, private router: Router,private storage: Storage) {
    // Ambil param yang dikirim dari venues.ts
    // 'var' ada di app-routing.module.ts
    this.venuesPage = this.actovatedRoute.snapshot.paramMap.get('var')
    this.storage.get('wsdcDataStorage').then((data) => {
      console.log("Masuk Venues Map");
      this.venuesMaps = data.venues;
      this.venuesMapsDetail = this.venuesMaps.filter(d=> d.id==this.venuesPage);
    })

    const printCurrentPosition = async () => {
      const coordinates = await Geolocation.getCurrentPosition();
      this.userCoordinatesLat = coordinates.coords.latitude;
      this.userCoordinatesLng = coordinates.coords.longitude;
    };
    
    printCurrentPosition();
  }

  ngOnInit() {
  }

  ionViewDidEnter() {
    const initializeMap = async () => {
      this.itemCounter = 0;
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
            target:{ //Kuta, Bali -8.722396, 115.17671
              latitude:-8.722396, 
              longitude: 	115.17671
            },
            zoom:11
          },
          preferences:{
            controls:{
              isCompassButtonEnabled:true,
              isMyLocationButtonEnabled:true,
              isZoomButtonsEnabled:true
            },
            appearance:{
              isMyLocationDotShown:true
            }
          },
        });
        
        element.style.background = "";
        element.setAttribute("data-maps-id", result.googleMap.mapId);
        this.mapid = result.googleMap.mapId;
        
        for(let venue of this.venuesMaps){
          if(this.venuesPage == venue.id){
            for(let venuesMarker of venue.geojson.features){
              this.itemCounter +=1;
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
  
      // Insert distance
      this.arrCoordinateLng = new Array(this.itemCounter);
      this.arrCoordinateLat = new Array(this.itemCounter);
      this.userDistanceTo = new Array(this.itemCounter);
      this.itemCounter = 0;
      for(let venue of this.venuesMaps){
        if(this.venuesPage == venue.id){
          for(let venuesMarker of venue.geojson.features){
            const koor = venuesMarker.geometry.coordinates;  
            this.arrCoordinateLat[this.itemCounter]= koor[1];
            this.arrCoordinateLng[this.itemCounter]= koor[0];
            this.computeDistance(this.userCoordinatesLat,this.userCoordinatesLng,this.arrCoordinateLat[this.itemCounter],this.arrCoordinateLng[this.itemCounter])
            this.userDistanceTo[this.itemCounter] = this.userDistance;
            this.itemCounter+=1;
          }
        }
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
      duration:800
    });     
  } 

  computeDistance(x1, y1, x2,  y2){
      // Calculating distance
      const R = 6371e3; // metres
      const φ1 = x1 * Math.PI/180; // φ, λ in radians
      const φ2 = x2 * Math.PI/180;
      const Δφ = (x2-x1) * Math.PI/180;
      const Δλ = (y2-y1) * Math.PI/180;

      const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
                Math.cos(φ1) * Math.cos(φ2) *
                Math.sin(Δλ/2) * Math.sin(Δλ/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

      const d = R * c; // in metres
      const dist= Math.ceil(d);

      if(dist < 1000){
        this.userDistance = dist + " km";
      }else if (dist < 100000){
        this.userDistance = Math.ceil(d/1000) + " km";
      }else{
        this.userDistance = ">99km"
      }
      // console.log(Math.ceil(d/1000) + " km");
  }
}
