import { SpaLocalStorage, SpaContainerLocalStorage } from './local-storage.model';
export class LocalStorageInitializeService {

  static getLocalStorageInitial(userName: string): SpaLocalStorage {
    return {
      currentLang: 'es-ES',
      userName: userName,
      isAuthenticated: true,
      cruds: [],
    };
  }

  static getContainerLocalStorageInitial(userName: string): SpaContainerLocalStorage {
    return {
      currentUserName: userName,
      spaLocalStorages: [this.getLocalStorageInitial(userName)]
    };
  }
}
