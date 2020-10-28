import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CrudFormComponent } from './component';
import { SharedNgZorroAntdModule } from './shared-ng-zorro-antd.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { CoreModule } from '../core/core.module';

@NgModule({
  exports: [
    CrudFormComponent
  ],
  declarations: [
    CrudFormComponent
  ],
  imports: [
    CommonModule,
    CoreModule,
    FormsModule,
    ReactiveFormsModule,
    SharedNgZorroAntdModule,
    TranslateModule
  ]
})
export class SharedModule { }
