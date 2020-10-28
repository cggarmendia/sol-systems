import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { CrudActions } from './crud.action';
import { CrudApiService } from '../../api';
import { CrudModel } from '../../model';
import { utils } from '../../core';

@Injectable({
  providedIn: 'root',
})
export class CrudEffects {
  constructor(
    private actions$: Actions,
    private crudApi: CrudApiService
  ) {}

  loadCruds$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CrudActions.loadCrud),
      mergeMap(() =>
        this.crudApi.getMock().pipe(
          map((cruds: CrudModel[]) =>
            CrudActions.loadCrudSuccess({
              cruds: cruds
            })
          ),
          catchError((error) =>
            of(CrudActions.actionCrudFailure(utils.handleError(error)))
          )
        )
      )
    );
  });
}
