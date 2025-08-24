import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideHttpClient, withFetch } from '@angular/common/http';

import { TranslateModule } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { routes } from './app.routes';
import { provideRouter } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withFetch()),

    importProvidersFrom(
      BrowserAnimationsModule,
      ToastrModule.forRoot({
        positionClass: 'toast-bottom-right',
        timeOut: 6000,
        closeButton: true,
        progressBar: true,
      }),
      TranslateModule.forRoot(),
    ),
    provideTranslateHttpLoader({
      prefix: 'assets/i18n/',
      suffix: '.json',
    }),

    provideRouter(routes),
  ],
};
