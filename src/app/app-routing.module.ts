import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'announcement',
    loadChildren: () => import('./announcement/announcement.module').then(m => m.AnnouncementPageModule)
  },
  {
    path: 'draw',
    loadChildren: () => import('./draw/draw.module').then(m => m.DrawPageModule)
  },
  {
    path: 'schedule',
    loadChildren: () => import('./schedule/schedule.module').then(m => m.SchedulePageModule)
  },
  {
    path: 'result',
    loadChildren: () => import('./result/result.module').then(m => m.ResultPageModule)
  },
  {
    path: 'info',
    loadChildren: () => import('./info/info.module').then(m => m.InfoPageModule)
  },
  {
    path: 'venues',
    loadChildren: () => import('./venues/venues.module').then(m => m.VenuesPageModule)
  },
  {
    path: 'venues-map',
    loadChildren: () => import('./venues-map/venues-map.module').then(m => m.VenuesMapPageModule)
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
