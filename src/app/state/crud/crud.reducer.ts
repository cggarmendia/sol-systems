import { createReducer, on } from '@ngrx/store';
import { LocalStorageService } from 'src/app/core';
import { CrudActions } from './crud.action';
import { CrudState } from './crud.state';


const initialState: CrudState = {
    cruds: LocalStorageService.getCruds(),
    error: ''
}

export const crudReducer = createReducer<CrudState>(
    initialState,
    on(
        CrudActions.loadCrudSuccess,
        (state, action): CrudState => {
            LocalStorageService.setCruds(action.cruds);
            return {
                ...state,
                cruds: action.cruds,
                error: ''
            };
        }
    ),
    on(
        CrudActions.actionCrudFailure,
        (state, action): CrudState => {
            return {
                ...state,
                error: action.error,
            };
        }
    ),
    on(
        CrudActions.deleteCrud,
        (state, action): CrudState => {
            LocalStorageService.setCruds(action.cruds);
            return {
                ...state,
                cruds: action.cruds,
                error: ''
            };
        }
    ),
    on(
        CrudActions.editCrud,
        (state, action): CrudState => {
            const cruds = state.cruds.map(crud => crud.key == action.crud.key ? action.crud : crud);
            LocalStorageService.setCruds(cruds);
            return {
                ...state,
                cruds: cruds,
            };
        }
    )
);
