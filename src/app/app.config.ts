import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
  importProvidersFrom,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpToastInterceptor } from './core/auth/interceptors/toast-service';
import { ToastService } from './layouts/public/avisos/toast.service';
import { provideClientHydration } from '@angular/platform-browser';
import { JwtInterceptor } from './core/auth/interceptors/jwt.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([JwtInterceptor, HttpToastInterceptor])),
    importProvidersFrom(FormsModule, ReactiveFormsModule),
    ToastService,
  ],
};

export const API_URL = { baseUrl: 'http://localhost:8080' };
