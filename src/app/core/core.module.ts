import { ErrorHandler, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { I18nComponent } from './components/i18n/i18n.component';
import { StoreModule } from '@ngrx/store';
import { i18nReducer } from '../state/i18n';
import { interceptors } from './interceptors';
import { GlobalErrorHandlerService } from './services';

@NgModule({
  declarations: [I18nComponent],
  imports: [
    CommonModule,
    StoreModule.forFeature('i18n', i18nReducer)
  ],
  providers: [
    ...interceptors,
    { provide: ErrorHandler, useClass: GlobalErrorHandlerService }
  ],
  exports: [I18nComponent]
})
export class CoreModule { }
