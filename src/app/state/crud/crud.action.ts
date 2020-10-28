import { createAction, props } from '@ngrx/store'
import { CrudModel } from '../../model';

const loadCrud = createAction('[crud] load crud');
const loadCrudSuccess = createAction('[crud] load crud success', props<{cruds: CrudModel[]}>());
const actionCrudFailure = createAction('[crud] load crud failure', props<{ error: string }>());
const editCrud = createAction('[crud] edit crud', props<{crud: CrudModel}>());
const deleteCrud = createAction('[crud] delete crud', props<{cruds: CrudModel[]}>());

export const CrudActions = {
    loadCrud,
    loadCrudSuccess,
    actionCrudFailure,
    editCrud,
    deleteCrud
};