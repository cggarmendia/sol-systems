import { NgModule } from '@angular/core';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NZ_ICONS, NzIconModule } from 'ng-zorro-antd/icon';

import { IconDefinition } from '@ant-design/icons-angular';
import * as AllIcons from '@ant-design/icons-angular/icons';

const antDesignIcons = AllIcons as {
  [key: string]: IconDefinition;
};
const icons: IconDefinition[] = Object.keys(antDesignIcons).map(
  (key) => antDesignIcons[key]
);

@NgModule({
  declarations: [],
  imports: [    
    NzLayoutModule,
    NzMenuModule,
    NzIconModule
  ],
  exports: [    
    NzLayoutModule,
    NzMenuModule,
    NzIconModule
  ],
  providers: [
    { provide: NZ_ICONS, useValue: icons }
  ]
})
export class AppNgZorroModule { }
