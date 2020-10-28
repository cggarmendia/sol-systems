import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { of, Subscription } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { CrudApiService } from 'src/app/api';
import { CrudModel } from 'src/app/model';
import { CrudActions } from 'src/app/state/crud';
import { I18nComponent, utils } from '../../../core';
import { getCurrentLang } from '../../../state/i18n';
import { State as I18nState } from '../../../state/i18n/i18n.state';
import { Translations, initTranslations } from './view-models';
import { State as CrudState } from '../../../state/crud/crud.state';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent extends I18nComponent implements OnInit, OnDestroy {
  addCrudSub: Subscription;
  translations: Translations = initTranslations();

  constructor(
    readonly i18nStore: Store<I18nState>,
    private translateService: TranslateService,
    private toastrService: ToastrService,
    private router: Router,
    private crudApiService: CrudApiService,    
    private crudStore: Store<CrudState>
    ) { 
    super(i18nStore, translateService);
    this.customCurrentLangSub = this.i18nStore
        .select(getCurrentLang)
        .subscribe(() => {
            this.translateService.get(Object.keys(this.translations)).subscribe((trans: any[]) => {
                Object.keys(trans).forEach(tran => {
                    this.translations[tran] = trans[tran];
                });
            });
        });
  }

  ngOnDestroy(): void {
    utils.unsubscribe([
      this.addCrudSub
    ]);
  }

  ngOnInit(): void {
  }

  onAdded(crudName: string){
    this.addCrudSub = this.crudApiService
    .createCrudMock(new CrudModel('', crudName))
    .pipe(
      map( () => this.onAddedSuccess(crudName) ),
      catchError(error => of(this.onAddedFailure(error) ) )
    )
    .subscribe();
  }

  private onAddedFailure(error: any) {
    var errorMessage = utils.handleError(error);
    if(error.status !== 404)  {
      this.toastrService.error(errorMessage.error, 'Error');
    }
    CrudActions.actionCrudFailure(errorMessage);
    this.router.navigate(['/']);
  }

  private onAddedSuccess(crudName: string) {
    this.toastrService.success(this.translations['confirmed-added'].replace('{userName}', crudName));
    this.router.navigate(['/crud']);
  }
}
