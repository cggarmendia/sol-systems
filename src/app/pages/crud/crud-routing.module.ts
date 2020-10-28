
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddComponent } from './add/add.component';
import { CrudComponent } from './crud.component';
import { EditComponent } from './edit/edit.component';

const routes: Routes = [
  { 
    path: '', 
    component: CrudComponent    
  },
  { path: 'create', component: AddComponent },
  { path: 'edit/:crudKey', component: EditComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CrudRoutingModule { }
