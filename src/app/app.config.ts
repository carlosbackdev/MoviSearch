import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import {  provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';
import { MarkdownModule } from 'ngx-markdown';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { firebaseConfig } from '../environments/fira';
import { getAuth, provideAuth } from '@angular/fire/auth';


export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(), 
    provideFirebaseApp(() => initializeApp(firebaseConfig.firebaseConfig)),
    provideAuth(() => getAuth()),
    importProvidersFrom(MarkdownModule.forRoot())  
  ],
};
