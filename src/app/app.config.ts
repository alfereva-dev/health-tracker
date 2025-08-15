import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideHttpClient, withFetch } from '@angular/common/http';

import { TranslateModule } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { routes } from './app.routes';
import { provideRouter } from '@angular/router';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withFetch()),

    importProvidersFrom(TranslateModule.forRoot()),

    provideTranslateHttpLoader({
      prefix: 'assets/i18n/',
      suffix: '.json',
    }),

    provideRouter(routes),
  ],
};
