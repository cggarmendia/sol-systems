import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthorizeGuard } from '../api-authorization/';

const routes: Routes = [
  { 
    path: '', 
    children: [
      {
        path: 'component-interaction',
        loadChildren: () => import('./pages/component-interaction/component-interaction.module').then(m => m.ComponentInteractionModule)
      },
      {
        path: 'ngx-translate',
        loadChildren: () => import('./pages/ngx-translate/ngx-translate.module').then(m => m.NgxTranslateModule)
      },
      {
        path: 'oidc',
        canActivate: [AuthorizeGuard],
        loadChildren: () => import('./pages/oidc/oidc.module').then(m => m.OidcModule)
      },
      {
        path: 'crud',
        loadChildren: () => import('./pages/crud/crud.module').then(m => m.CrudModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
