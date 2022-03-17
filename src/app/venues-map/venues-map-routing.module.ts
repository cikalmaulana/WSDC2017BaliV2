import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VenuesMapPage } from './venues-map.page';

const routes: Routes = [
  {
    path: '',
    component: VenuesMapPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VenuesMapPageRoutingModule {}
