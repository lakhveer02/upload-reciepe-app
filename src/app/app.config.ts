import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideClientHydration(), provideAnimations(), importProvidersFrom(provideFirebaseApp(() => initializeApp({"projectId":"fir-deploy-585cc","appId":"1:441585143332:web:faf139ea148e88f6fdd2b1","storageBucket":"fir-deploy-585cc.appspot.com","apiKey":"AIzaSyDxwEY-A5jnica1HGUqs2JayUfjgzSKPQU","authDomain":"fir-deploy-585cc.firebaseapp.com","messagingSenderId":"441585143332","measurementId":"G-H68M0THSLZ"}))), importProvidersFrom(provideAuth(() => getAuth())), importProvidersFrom(provideFirestore(() => getFirestore())), importProvidersFrom(provideStorage(() => getStorage()))]
};
