import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { I18nComponent } from 'src/app/core/components/i18n/i18n.component';
import { TranslateService } from '@ngx-translate/core';
import { Store } from '@ngrx/store';
import { State as I18nState } from '../../../state/i18n/i18n.state';
import { Input } from '@angular/core';
import { Output } from '@angular/core';

@Component({
  selector: 'crud-form',
  templateUrl: './crud-form.component.html',
  styleUrls: ['./crud-form.component.scss']
})
export class CrudFormComponent  extends I18nComponent implements OnInit {
  @Input() crudName: string;
  @Output() crudEvent = new EventEmitter<string>();
  crudForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    readonly i18nStore: Store<I18nState>,
    readonly translate : TranslateService
    ) {
      super(i18nStore, translate);
  }

  ngOnInit(): void {
    this.crudForm = this.fb.group({
      crudName: [
        null, 
        [
          Validators.required
        ]
      ]
    });
    this.crudForm.setValue( { 'crudName': this.crudName ?? '' } );
  }
  
  submitForm(): void {
    for (const i in this.crudForm.controls) {
      this.crudForm.controls[i].markAsDirty();
      this.crudForm.controls[i].updateValueAndValidity();
    }
    this.crudEvent.emit(this.crudForm.value['crudName']);
    this.crudForm.reset();
  }

}
