import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { of, Subscription } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { CrudApiService } from '../../api';
import { I18nComponent, utils } from 'src/app/core';
import { CrudModel } from '../../model';
import { CrudActions, getCruds } from '../../state/crud';
import { State as CrudState } from '../../state/crud/crud.state';
import { getCurrentLang } from '../../state/i18n';
import { State as I18nState } from '../../state/i18n/i18n.state';
import { CrudViewModel, initTranslations, Translations } from './view-models';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-crud',
  templateUrl: './crud.component.html',
  styleUrls: ['./crud.component.scss']
})
export class CrudComponent extends I18nComponent implements OnInit, OnDestroy {
  private crudSub: Subscription;
  private deleteSub: Subscription;
  public cruds: CrudViewModel[];
  translations: Translations = initTranslations();

  constructor(
    private modal: NzModalService,
    private crudStore: Store<CrudState>,
    private crudApiService: CrudApiService,
    private toastrService: ToastrService,
    private router: Router,
    readonly i18nStore: Store<I18nState>,
    readonly translate : TranslateService
    ) {
      super(i18nStore, translate);
      this.customCurrentLangSub = this.i18nStore
      .select(getCurrentLang)
      .subscribe(() => {
          this.translate.get(Object.keys(this.translations)).subscribe((trans: any[]) => {
              Object.keys(trans).forEach(tran => {
                  this.translations[tran] = trans[tran];
              });
          });
      });
    }

  ngOnDestroy() {
    utils.unsubscribe([this.crudSub, this.deleteSub]);
  }

  ngOnInit(): void {
    this.cruds = [];

    this.crudSub = this.crudStore
            .select(getCruds)
            .subscribe((cruds) => {
              if(cruds){
                this.cruds = []
                cruds.map( model =>
                  this.cruds.push({
                    key: model.key,
                    name: model.name,
                    editUrl: `/crud/edit/${model.key}`
                  })
                );
              }
            });

    this.crudStore.dispatch(CrudActions.loadCrud());
  }

  showDeleteConfirm(id: string, name: string): void {
    this.modal.confirm({
      nzTitle: this.translations['delete-modal.message'],
      nzContent: `<b style="color: red;">${this.translations['delete-modal.description']}</b>`,
      nzOkText: this.translations['delete-modal.yes'],
      nzOkType: 'danger',
      nzOnOk: () => this.onDeleted(id, name),
      nzCancelText: this.translations['delete-modal.no'],
      nzOnCancel: () => console.log('Cancel')
    });
  }

  onDeleted(crudKey: string, crudName: string){
    this.deleteSub = this.crudApiService
    .deleteCrudMock(crudKey)
    .pipe(
      map( cruds => this.onDeletedSuccess(cruds, crudName) ),
      catchError(error => of(this.onDeletedFailure(error) ) )
    )
    .subscribe();
  }
  
  private onDeletedSuccess(cruds: CrudModel[], crudName: string) {
    this.crudStore.dispatch(CrudActions.deleteCrud({ cruds: cruds }));
    this.toastrService.success(this.translations['confirmed-deleted'].replace('{userName}', crudName));
  }
  
  private onDeletedFailure(error: any) {
    var errorMessage = utils.handleError(error);
    if(error.status !== 404)  {
      this.toastrService.error(errorMessage.error, 'Error');
    }
    CrudActions.actionCrudFailure(errorMessage);
    this.router.navigate(['/']);
  }
}
