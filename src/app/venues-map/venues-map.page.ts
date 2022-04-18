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
export class VenuesMapPage implements OnInit {
  venuesPage: any;
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
  data: any;
  items: Array<{id: string, name: string, lat: string, lang: string, description: string, distance: string, idcolor:number }>
  pageTitleColors: Array<string> = ["#ec1c24", "#c49a6c", "#d189bb", "#4d113f"];
  coloridx: number;

  constructor(private actovatedRoute: ActivatedRoute, private router: Router,private storage: Storage) {

    //Get data from venues page.
    this.items = [];
    this.actovatedRoute.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.data = this.router.getCurrentNavigation().extras.state.venuesData;
        this.venuesPage = this.data;
      }
      
      for (let wsdcVenueFeatures of this.venuesPage.geojson.features) {
        this.items.push({
          name: wsdcVenueFeatures.properties.Name,
          id: this.venuesPage.id,
          idcolor: this.venuesPage.colorIdx,
          lang: wsdcVenueFeatures.geometry.coordinates[0],
          lat: wsdcVenueFeatures.geometry.coordinates[1],
          description: wsdcVenueFeatures.properties.Description,
          distance: '? km'
        });
      }
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
  }

  ngOnInit() {
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
      this.arrCoordinateLng = new Array(this.itemCounter);
      this.arrCoordinateLat = new Array(this.itemCounter);
      this.userDistanceTo = new Array(this.itemCounter);
      this.itemCounter = 0;
      for(let venue of this.venuesMapsDetail){
        for(let venuesMarker of venue.geojson.features){
          const koor = venuesMarker.geometry.coordinates;  
          this.arrCoordinateLat[this.itemCounter]= koor[1];
          this.arrCoordinateLng[this.itemCounter]= koor[0];
          this.computeDistance(this.userCoordinatesLat,this.userCoordinatesLng,this.arrCoordinateLat[this.itemCounter],this.arrCoordinateLng[this.itemCounter])
          this.userDistanceTo[this.itemCounter] = this.userDistance;
          this.itemCounter+=1;
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

  featTapped(coordinates){
    this.coordinates = coordinates;
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

  computeDistance(lat1, lat2, lon1, lon2){
    // The math module contains a function
    // named toRadians which converts from
    // degrees to radians.
    lon1 =  lon1 * Math.PI / 180;
    lon2 = lon2 * Math.PI / 180;
    lat1 = lat1 * Math.PI / 180;
    lat2 = lat2 * Math.PI / 180;
    // Haversine formula
    let dlon = lon2 - lon1;
    let dlat = lat2 - lat1;
    let a = Math.pow(Math.sin(dlat / 2), 2)
              + Math.cos(lat1) * Math.cos(lat2)
              * Math.pow(Math.sin(dlon / 2),2);
    let c = 2 * Math.asin(Math.sqrt(a));
    // Radius of earth in kilometers. Use 3956
    // for miles
    let r = 6371;
    let d = c * r;

    if(d < 1000){
      this.userDistance = Math.floor(d) + " m";
    }else if (d < 100000){
      this.userDistance = Math.floor(d/1000) + " km";
    }else{
      this.userDistance = ">99 km"
    }
  }
}
