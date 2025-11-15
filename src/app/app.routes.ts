import { Routes } from '@angular/router';
import path from 'path';
import { LoginComponente } from './pages/home/login/login';

export const routes: Routes = [
  { path: '', component: LoginComponente },
  { path: 'login', component: LoginComponente },
];
