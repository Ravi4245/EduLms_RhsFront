import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors,withFetch } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth.interceptor';
 // ✅ adjust if needed

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideHttpClient(withInterceptors([AuthInterceptor])),
    provideHttpClient(withFetch()), // ✅ Updated
    provideRouter(routes),
    provideClientHydration(withEventReplay())
  ]
};
