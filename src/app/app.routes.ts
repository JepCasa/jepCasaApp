import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./inicio/inicio').then(m => m.Inicio)  },
  { path: 'inicio', loadComponent: () => import('./inicio/inicio').then(m => m.Inicio) },
  { path: 'llamamiento', loadComponent: () => import('./llamamiento/llamamiento').then(m => m.Llamamiento) },
  { path: 'jovenes', loadComponent: () => import('./jovenes/jovenes').then(m => m.Jovenes) },
  { path: '**', redirectTo: '' }
];
