import { Routes } from '@angular/router';
import path from 'path';
import { LoginComponente } from './pages/home/login/login';
import { AuthGuard } from './core/auth/guard/auth.guard';
import { LayoutTopBarAdmin } from './layouts/private/admin/layout-top-bat.component';

export const routes: Routes = [
  { path: '', component: LoginComponente },
  { path: 'login', component: LoginComponente },

  // Rutas privadas Admin
  {
    path: 'admin',
    canActivate: [AuthGuard],
    component: LayoutTopBarAdmin,
    children: [
      { path: '', redirectTo: 'canciones', pathMatch: 'full' }, // Redirección automática al cargar la ruta 'admin'
      {
        path: 'canciones',
        loadComponent: () =>
          import('./pages/admin/canciones-admin/canciones-admin').then(
            (m) => m.CancionesAdminComponent
          ),
      },
      {
        path: 'usuarios',
        loadComponent: () =>
          import('./pages/admin/gestion-usuarios/gestion-usuarios').then((m) => m.GestionUsuarios),
      },
      {
        path: 'metricas',
        loadComponent: () =>
          import('./pages/admin/metricas-sistema/metricas-sistema').then((m) => m.MetricasSistema),
      },
    ],
  },
];
