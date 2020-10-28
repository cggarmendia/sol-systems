import { Injectable } from '@angular/core';
import { User, UserManager, UserManagerSettings, Profile } from 'oidc-client';
import { BehaviorSubject, concat, from, Observable } from 'rxjs';
import { filter, map, mergeMap, take, tap } from 'rxjs/operators';
import { LocalStorageService } from 'src/app/core';

export type IAuthenticationResult =
  SuccessAuthenticationResult |
  FailureAuthenticationResult |
  RedirectAuthenticationResult;

export interface SuccessAuthenticationResult {
  status: AuthenticationResultStatus.Success;
  state: any;
}

export interface FailureAuthenticationResult {
  status: AuthenticationResultStatus.Fail;
  message: string;
}

export interface RedirectAuthenticationResult {
  status: AuthenticationResultStatus.Redirect;
}

export enum AuthenticationResultStatus {
  Success,
  Redirect,
  Fail
}

export interface IUser {
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthorizeService {
  private popUpDisabled = true;
  private userManager: UserManager;
  private userSubject: BehaviorSubject<IUser | null> = new BehaviorSubject(null);
  private completeSignInWrapper: (userName: string) => void = LocalStorageService.logIn;
  private completeSignOutWrapper: () => void = LocalStorageService.logOut;

  public isAuthenticated(): Observable<boolean> {
    return this.getUser().pipe(map(u => !!u));
  }

  public getUser(): Observable<IUser | null> {
    return concat(
      this.userSubject.pipe(take(1), filter(u => !!u)),
      this.getUserFromStorage().pipe(filter(u => !!u), tap(u => this.userSubject.next(u))),
      this.userSubject.asObservable());
  }

  public getAccessToken(): Observable<string> {
    return from(this.ensureUserManagerInitialized())
      .pipe(mergeMap(() => from(this.userManager.getUser())),
        map(user => user && user.access_token));
  }

  public async signIn(state: any): Promise<IAuthenticationResult> {
    await this.ensureUserManagerInitialized();
    let user: User = null;
    try {
      user = await this.userManager.signinSilent(this.createArguments());
      this.userSubject.next({ name: user.profile.name });
      return this.success(state);
    } catch (silentError) {
      console.log('Silent authentication error: ', silentError);

      try {
        if (this.popUpDisabled) {
          throw new Error('Popup disabled. Change \'authorize.service.ts:AuthorizeService.popupDisabled\' to false to enable it.');
        }
        user = await this.userManager.signinPopup(this.createArguments());
        this.userSubject.next(this.getIUserFromProfile(user.profile));
        return this.success(state);
      } catch (popupError) {
        if (popupError.message === 'Popup window closed') {
          return this.error('The user closed the window.');
        } else if (!this.popUpDisabled) {
          console.log('Popup authentication error: ', popupError);
        }

        try {
          await this.userManager.signinRedirect(this.createArguments(state));
          return this.redirect();
        } catch (redirectError) {
          console.log('Redirect authentication error: ', redirectError);
          return this.error(redirectError);
        }
      }
    }
  }

  public async completeSignIn(url: string): Promise<IAuthenticationResult> {
    try {
      await this.ensureUserManagerInitialized();
      const user = await this.userManager.signinCallback(url);
      this.userSubject.next(user && this.getIUserFromProfile(user.profile));
      if(user && user.state){
        this.completeSignInWrapper(user.profile.name);
      }
      return this.success(user && user.state);
    } catch (error) {
      console.log('There was an error signing in: ', error);
      return this.error('There was an error signing in.');
    }
  }

  public async signOut(state: any): Promise<IAuthenticationResult> {
    try {
      if (this.popUpDisabled) {
        throw new Error('Popup disabled. Change \'authorize.service.ts:AuthorizeService.popupDisabled\' to false to enable it.');
      }

      await this.ensureUserManagerInitialized();
      await this.userManager.signoutPopup(this.createArguments());
      this.userSubject.next(null);
      return this.success(state);
    } catch (popupSignOutError) {
      console.log('Popup signout error: ', popupSignOutError);
      try {
        await this.userManager.signoutRedirect(this.createArguments(state));
        return this.redirect();
      } catch (redirectSignOutError) {
        console.log('Redirect signout error: ', popupSignOutError);
        return this.error(redirectSignOutError);
      }
    }
  }

  public async completeSignOut(url: string): Promise<IAuthenticationResult> {
    await this.ensureUserManagerInitialized();
    try {
      const state = await this.userManager.signoutCallback(url);
      this.userSubject.next(null);
      this.completeSignOutWrapper();
      return this.success(state && state.state.data);
    } catch (error) {
      console.log(`There was an error trying to log out '${error}'.`);
      return this.error(error);
    }
  }

  private createArguments(state?: any): any {
    return { useReplaceToNavigate: true, data: state };
  }

  private error(message: string): IAuthenticationResult {
    return { status: AuthenticationResultStatus.Fail, message };
  }

  private success(state: any): IAuthenticationResult {
    return { status: AuthenticationResultStatus.Success, state };
  }

  private redirect(): IAuthenticationResult {
    return { status: AuthenticationResultStatus.Redirect };
  }

  private async ensureUserManagerInitialized(): Promise<void> {
    if (this.userManager !== undefined) {
      return;
    }

    const settings: any = getClientSettings();
    settings.automaticSilentRenew = true;
    settings.includeIdTokenInSilentRenew = true;
    this.userManager = new UserManager(settings);

    this.userManager.events.addUserSignedOut(async () => {
      await this.userManager.removeUser();
      this.userSubject.next(null);
    });
  }

  private getUserFromStorage(): Observable<IUser> {
    return from(this.ensureUserManagerInitialized())
      .pipe(
        mergeMap(() => this.userManager.getUser()),
        map(u => u && this.getIUserFromProfile(u.profile)));
  }  

  getIUserFromProfile(profile: Profile){
    return { name: profile.name }
  }
}

export function getClientSettings(): UserManagerSettings {
  return {
      authority: 'https://localhost:44310/',
      client_id: 'DBS.Creator.Spa',
      redirect_uri: 'http://localhost:4200/authentication/login-callback',
      post_logout_redirect_uri: 'http://localhost:4200/authentication/logout-callback',
      response_type: 'id_token token',
      scope: 'openid profile',
      filterProtocolClaims: true,
      loadUserInfo: true
  };
}
