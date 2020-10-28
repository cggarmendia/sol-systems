import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { State as I18nState } from './state/i18n/i18n.state';
import { I18nComponent } from './core/components/i18n/i18n.component';
import { en_US, es_ES, NzI18nService } from 'ng-zorro-antd/i18n';
import { getCurrentLang } from './state/i18n';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent  extends I18nComponent {
  isCollapsed = false;
  private langNgZorroMap: Map<string, any> = new Map([ 
    [ 'es-ES', es_ES], 
    [ 'en-EN', en_US]
  ]);

  constructor(
    private i18n: NzI18nService,
    readonly i18nStore: Store<I18nState>,
    readonly translate : TranslateService
    ) {
      super(i18nStore, translate);
      this.customCurrentLangSub = i18nStore.select(getCurrentLang).subscribe(
        (lang: string) => { 
          this.initTranslate(lang); 
        }
      ); 
  }

  initTranslate(lang: string): void {
    this.i18n.setLocale(this.langNgZorroMap.get(lang));
  }
}
