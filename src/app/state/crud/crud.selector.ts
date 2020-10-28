import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CrudState } from './crud.state';

const geCrudFeatureState = createFeatureSelector<CrudState>('cruds');

export const getCruds = createSelector(
    geCrudFeatureState,
    (state) => state.cruds
);
