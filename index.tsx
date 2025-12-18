
import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { provideZonelessChangeDetection, LOCALE_ID } from '@angular/core';
import { DOCUMENT, registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';

import { AppComponent } from './src/app.component';

registerLocaleData(localePt);

bootstrapApplication(AppComponent, {
  providers: [
    provideZonelessChangeDetection(),
    provideHttpClient(),
    { provide: DOCUMENT, useValue: document },
    { provide: LOCALE_ID, useValue: 'pt-BR' },
  ],
}).catch((err) => console.error(err));

// AI Studio always uses an `index.tsx` file for all project types.