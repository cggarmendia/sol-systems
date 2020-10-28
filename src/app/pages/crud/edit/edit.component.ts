import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent extends I18nComponent implements OnInit, OnDestroy  {
  @Input() model: CrudModel = new CrudModel('','');
  editCrudSub: Subscription;
  getCrudByIdSub: Subscription;
  translations: Translations = initTranslations();

  constructor(
    readonly i18nStore: Store<I18nState>,
    private translateService: TranslateService,
    private toastrService: ToastrService,
    private router: Router,
    private crudApiService: CrudApiService,   
    private crudStore: Store<CrudState>,
    private route: ActivatedRoute) { 
    super(i18nStore, translateService);
    this.route.params.subscribe((params) => {
      if (params.crudKey) {
        this.model.key = params.crudKey;
      }
    });
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
      this.editCrudSub,
      this.getCrudByIdSub
    ]);
  }

  ngOnInit(): void {
    this.getCrudByIdSub = this.crudApiService
    .getCrudByIdMock(this.model.key)
    .pipe(
      map( crud => this.model = new CrudModel(crud.key, crud.name) ),
      catchError(error => of(this.onActionFailure(error) ) )
    )
    .subscribe();
  }

  onEdited(crudName: string){
    this.model.name = crudName;
    this.editCrudSub = this.crudApiService
    .updateCrudMock(this.model)
    .pipe(
      map( crud => this.onEditedSuccess(crud, crudName) ),
      catchError(error => of(this.onActionFailure(error) ) )
    )
    .subscribe();
  }

  private onActionFailure(error: any) {
    var errorMessage = utils.handleError(error);
    if(error.status !== 404)  {
      this.toastrService.error(errorMessage.error, 'Error');
    }
    CrudActions.actionCrudFailure(errorMessage);
    this.router.navigate(['/']);
  }

  private onEditedSuccess(crud: CrudModel, crudName: string) {
    this.crudStore.dispatch(CrudActions.editCrud({ crud: crud }));
    this.toastrService.success(this.translations['confirmed-edited'].replace('{userName}', crudName));
    this.router.navigate(['/crud']);
  }
}
