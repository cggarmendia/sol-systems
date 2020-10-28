import { Component, OnInit } from '@angular/core';
import { AuthorizeService } from 'src/api-authorization';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import { I18nComponent } from 'src/app/core';
import { TranslateService } from '@ngx-translate/core';
import { State as I18nState } from '../../state/i18n/i18n.state';

@Component({
  selector: 'app-oidc',
  templateUrl: './oidc.component.html',
  styleUrls: ['./oidc.component.scss']
})
export class OidcComponent extends I18nComponent implements OnInit {
  userName: string;
  userNameSub: Subscription;

  constructor(
    private authorizeService: AuthorizeService,
    readonly i18nStore: Store<I18nState>,
    readonly translate : TranslateService
    ) {
      super(i18nStore, translate);
    }

  ngOnInit(): void {
    this.userNameSub = this.authorizeService.getUser().subscribe(user => 
      this.userName = user.name
    );
  }

}
