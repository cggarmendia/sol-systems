import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { environment } from '../../../environments/environment';
import { CrudModel } from '../../model';
import { of, Subscription } from 'rxjs';
import { State as CrudState } from '../../state/crud/crud.state';
import { Store } from '@ngrx/store';
import { getCruds } from 'src/app/state/crud/crud.selector';

@Injectable({
  providedIn: 'root'
})
export class CrudApiService implements OnDestroy{
  private crudSubMock: Subscription;
  crudsMocks: CrudModel[] = [];
  baseUrl: string = `${environment.apiUrl}/api/crud`;
  headers: HttpHeaders = new HttpHeaders();

  constructor(
    private http: HttpClient,    
    private crudStore: Store<CrudState>) {
      this.headers.set('Content-Type', 'application/json');
      this.initCrudsMock();
  }

  ngOnDestroy(): void {
    this.crudSubMock?.unsubscribe();
  }

  public get = () => {
      this.headers.set('method', 'GET');
      return this.http.get<CrudModel[]>(this.baseUrl, { headers: this.headers });
  }

  public createCrud = (crudModel: CrudModel) => {
    this.headers.set('method', 'POST');
    return this.http.post(this.baseUrl, crudModel, { headers: this.headers });
  }

  public updateCrud = (crudModel: CrudModel) => {
    this.headers.set('method', 'PUT');
    return this.http.put(`${this.baseUrl}/${crudModel.key}`, crudModel, {
      headers: this.headers,
    });
  }

  public deleteCrud = (crudId: string) => {
    this.headers.set('method', 'DELETE');
    return this.http.delete(`${this.baseUrl}/${crudId}`, {
      headers: this.headers,
    });
  };

  public getCrudById = (id: string) => {
    this.headers.set('method', 'GET');
    return this.http.get(`${this.baseUrl}/${id}`, {
        headers: this.headers
    });
  }

  //#region mock-methods
  public getMock = () => {    
    return of(this.crudsMocks);
  }

  public createCrudMock = (crudModel: CrudModel) => {
    crudModel.key = `${this.getIdMock()}`;
    this.crudsMocks.push(crudModel);
    return of(crudModel);
  }

  public updateCrudMock = (crudModel: CrudModel) => {
    return of(crudModel);
  }

  public getCrudByIdMock = (id: string) => {
    return of(this.crudsMocks.find(mock => mock.key == id));
  }
  
  private getIdMock(): number {
    const randomNumber = Math.random().toString();
    return Number(randomNumber.toString().substring(2, randomNumber.length));
  }
  
  public deleteCrudMock = (crudId: string) => {
    this.crudsMocks = this.crudsMocks.filter(crud => crud.key !== crudId);
    return of(this.crudsMocks);
  };

  private initCrudsMock() {
    this.crudSubMock = this.crudStore
      .select(getCruds)
      .subscribe((cruds) => {
        if (cruds) {
          this.crudsMocks = [];
          cruds.map(crud=>this.crudsMocks.push(crud));
        }
      });
  }
  //#endregion
}
