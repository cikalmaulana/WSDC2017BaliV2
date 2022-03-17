import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VenuesMapPageRoutingModule } from './venues-map-routing.module';

import { VenuesMapPage } from './venues-map.page';

import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VenuesMapPageRoutingModule,
    HttpClientModule
  ],
  declarations: [VenuesMapPage]
})
export class VenuesMapPageModule { }
