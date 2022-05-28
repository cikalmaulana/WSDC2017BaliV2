import { Component, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { CapacitorGoogleMaps } from "@capacitor-community/google-maps";
import { Geolocation } from '@capacitor/geolocation';

@Component({
  selector: 'app-venues-map',
  templateUrl: './venues-map.page.html',
  styleUrls: ['./venues-map.page.scss'],
})
export class VenuesMapPage{
  venuesPage: any;
  venuesMapsDetail: any;
  userCoordinatesLat: any;
  userCoordinatesLng: any;
  mapid: any;
  userDistanceTo: string[];
  itemCounter: number;
  items: Array<{id: string, idcolor:number }>
  pageTitleColors: Array<string> = ["#ec1c24", "#c49a6c", "#d189bb", "#4d113f"];

  constructor(private activatedRoute: ActivatedRoute, private router: Router,private storage: Storage) {

    //Get data from venues page.
    this.items = [];
    this.activatedRoute.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.venuesPage = this.router.getCurrentNavigation().extras.state.venuesData;
      }
      
      this.items.push({
        id: this.venuesPage.id,
        idcolor: this.venuesPage.colorIdx
      });
      
      document.getElementById("pagetitle").style.color = this.pageTitleColors[this.items[0].idcolor-1];
    });

    // Select data from storage
    this.storage.get('wsdcDataStorage').then((data) => {
      this.venuesMapsDetail = data.venues;
      this.venuesMapsDetail = this.venuesMapsDetail.filter(d=> d.id==this.items[0].id);
    })

    //save user lat & lng location
    const printCurrentPosition = async () => {
      const coordinates = await Geolocation.getCurrentPosition();
      this.userCoordinatesLat = coordinates.coords.latitude;
      this.userCoordinatesLng = coordinates.coords.longitude;
    };
    
    printCurrentPosition();
    Geolocation.requestPermissions();
  }

  ionViewDidEnter() {
    // create map and add marker
    const initializeMap = async () => {
      this.itemCounter = 0;
      await CapacitorGoogleMaps.initialize({
        key: "YOUR_IOS_MAPS_API_KEY",
        devicePixelRatio: window.devicePixelRatio,
      });
      const element = document.getElementById("mapContainer");
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
        console.log(this.venuesMapsDetail);
        
        //add marker to each location
        for(let venue of this.venuesMapsDetail){
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
      } catch (e) {
        alert("Map failed to load");
      }
  
      // Insert distance to each location
      this.userDistanceTo = new Array(this.itemCounter);
      let counter = 0;
      for(let venue of this.venuesMapsDetail){
        for(let venuesMarker of venue.geojson.features){
          const koor = venuesMarker.geometry.coordinates;  
          this.userDistanceTo[counter] = this.computeDistance(this.userCoordinatesLat,koor[1],this.userCoordinatesLng,koor[0]);
          counter+=1;
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

  featTapped(venuesCoordinates){
    const coordinates = venuesCoordinates;
    CapacitorGoogleMaps.moveCamera({
      mapId:this.mapid,
      cameraPosition:{
        target:{
          latitude: coordinates[1],
          longitude: coordinates[0],
        },
        zoom:15
      },
      duration:800
    });     
  } 

  computeDistance(lat1, lat2, lon1, lon2){
    
    const R = 6371e3; // metres
    const phi1 = lat1 * Math.PI/180; // phi, lambda in radians
    const phi2 = lat2 * Math.PI/180;
    const deltaPhi = (lat2-lat1) * Math.PI/180;
    const deltaLambda = (lon2-lon1) * Math.PI/180;
    
    const a = Math.sin(deltaPhi/2) * Math.sin(deltaPhi/2) +
              Math.cos(phi1) * Math.cos(phi2) *
              Math.sin(deltaLambda/2) * Math.sin(deltaLambda/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    
    const d = R * c; // in metres

    
    if(d < 1000){
      return Math.floor(d) + " m";
    }else if (d < 100000){
      return Math.floor(d/1000) + " km";
    }else{
      return ">99 km"
    }

    // Credits to Movable Type Ltd on https://www.movable-type.co.uk/scripts/latlong.html
  }
}
