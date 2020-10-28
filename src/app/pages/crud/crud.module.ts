import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CrudComponent } from './crud.component';
import { AddComponent } from './add/add.component';
import { EditComponent } from './edit/edit.component';
import { CrudNgZorroModule } from './crud-ng-zorro.module';
import { CrudRoutingModule } from './crud-routing.module';
import { StoreModule } from '@ngrx/store';
import { crudReducer, CrudEffects } from '../../state/crud';
import { EffectsModule } from '@ngrx/effects';
import { SharedModule } from '../../shared';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

@NgModule({
  declarations: [CrudComponent, AddComponent, EditComponent],
  imports: [
    CommonModule,
    CrudNgZorroModule,
    StoreModule.forFeature('cruds', crudReducer),
    EffectsModule.forFeature([CrudEffects]),
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: translateHttpLoaderFactory,
        deps: [HttpClient]
      },
      isolate: true
    }),    
    CrudRoutingModule,
    SharedModule
  ]
})
export class CrudModule { }

export function translateHttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/crud/', '.json');
}
