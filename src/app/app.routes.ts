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
    ],
  },
];
