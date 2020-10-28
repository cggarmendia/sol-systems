import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OidcComponent } from './oidc.component';
import { OidcRoutingModule } from './oidc-routing.module';
import { OidcNgZorroModule } from './oidc-ng-zorro.module';

import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';

@NgModule({
  declarations: [OidcComponent],
  imports: [
    CommonModule,
    OidcNgZorroModule,
    OidcRoutingModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: oidcTranslateHttpLoaderFactory,
        deps: [HttpClient]
      },
      isolate: true
    })
  ],
  exports: [OidcComponent]
})
export class OidcModule { }

export function oidcTranslateHttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/oidc/', '.json');
}
