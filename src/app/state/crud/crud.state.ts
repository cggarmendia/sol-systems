import * as AppState from '../app.state';
import { CrudModel } from '../../model';

export interface State extends AppState.State {
    crud: CrudState;
}

export interface CrudState extends AppState.State {
    cruds: CrudModel[];
    error: string;
}
