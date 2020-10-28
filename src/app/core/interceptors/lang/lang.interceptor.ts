import { Injectable, OnDestroy } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { State } from '../../../state/i18n/i18n.state';
import { getCurrentLang } from '../../../state/i18n';

@Injectable()
export class LangInterceptor implements HttpInterceptor, OnDestroy {
  activeLang: string;
  langSub: Subscription;

  constructor(readonly i18nStore: Store<State>) {
    this.langSub = i18nStore
      .select(getCurrentLang)
      .subscribe((currentLang) => (this.activeLang = currentLang));
  }
  ngOnDestroy(): void {
    this.langSub.unsubscribe();
  }

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const langRequest = request.clone({
      headers: request.headers.set('x-language', this.activeLang),
    });

    return next.handle(langRequest);
  }
}

