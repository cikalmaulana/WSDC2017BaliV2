import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'folder/:id',
    loadChildren: () => import('./folder/folder.module').then(m => m.FolderPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'announcement',
    loadChildren: () => import('./pages/announcement/announcement.module').then(m => m.AnnouncementPageModule)
  },
  {
    path: 'draw',
    loadChildren: () => import('./pages/draw/draw.module').then(m => m.DrawPageModule)
  },
  {
    path: 'schedule',
    loadChildren: () => import('./pages/schedule/schedule.module').then(m => m.SchedulePageModule)
  },
  {
    path: 'result',
    loadChildren: () => import('./pages/result/result.module').then(m => m.ResultPageModule)
  },
  {
    path: 'info',
    loadChildren: () => import('./pages/info/info.module').then(m => m.InfoPageModule)
  },
  {
    path: 'venues',
    loadChildren: () => import('./pages/venues/venues.module').then(m => m.VenuesPageModule)
  },
  {
    path: 'venues-map/:var',
    loadChildren: () => import('./pages/venues-map/venues-map.module').then(m => m.VenuesMapPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
