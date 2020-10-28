import { CrudModel } from 'src/app/model';

export interface SpaLocalStorage{
    currentLang: string;
    isAuthenticated: boolean;
    userName: string;
    cruds: CrudModel[];
}

export interface SpaContainerLocalStorage {
  currentUserName: string;
  spaLocalStorages: SpaLocalStorage[];
}
