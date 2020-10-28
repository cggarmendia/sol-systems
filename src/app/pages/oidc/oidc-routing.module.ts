
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OidcComponent } from './oidc.component';

const routes: Routes = [
  { path: '', component: OidcComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OidcRoutingModule { }
