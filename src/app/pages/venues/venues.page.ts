import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { VenuesMapPageModule } from '../venues-map/venues-map.module';
import { Router } from '@angular/router';

@Component({
  selector: 'app-venues',
  templateUrl: './venues.page.html',
  styleUrls: ['./venues.page.scss'],
})
export class VenuesPage implements OnInit {
  wsdcData: any;
  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit() {
    this.http.get('https://wsdc.dnartworks.com/wsdc_data.json').subscribe((data: any) => {
      this.wsdcData = data.venues;
    });
  }

  itemTapped(id) {
    this.router.navigate(['venues-map', id])
  }
}
