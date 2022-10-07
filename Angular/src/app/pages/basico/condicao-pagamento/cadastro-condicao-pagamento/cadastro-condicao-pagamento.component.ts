import { PoBreadcrumb } from '@po-ui/ng-components';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { PostPaymentTerms } from './cadastro-condicao-pagamento.service';
import { DataManipulation } from 'src/app/components/shared/shared-services.service';
import { PoNotificationService } from '@po-ui/ng-components';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { AllValidationErrors, getFormValidationErrors } from 'src/app/components/shared/validador/get-form-validation-errors';

@Component({
  selector: 'app-cadastro-condicao-pagamento',
  templateUrl: './cadastro-condicao-pagamento.component.html',
  styleUrls: ['./cadastro-condicao-pagamento.component.css'],
  providers: [PostPaymentTerms, DataManipulation]
})
export class CadastroCondicaoPagamentoComponent implements OnInit {

  validForm!: UntypedFormGroup;
  typeCad!: string;
  pageTitle: string = 'Nova condição de pagamento';
  newRegister = true;

  public readonly breadcrumb: PoBreadcrumb = {
    items: [{ label: 'Listagem condições de pagamento', link: '/condicao-pagamento' }, { label: 'Manutenção de condições de pagamento' }]
  };

  constructor(
    private fb: UntypedFormBuilder,
    private router: Router,
    public poNotification: PoNotificationService,
    private dataService: DataManipulation,
    private cPService: PostPaymentTerms,
    private route: ActivatedRoute
  ) {
    this.route.params.subscribe(params => {
      this.typeCad = params['id']
      if (params['id'] != '0') {
        this.pageTitle = "Editar condição de pagamento"
        this.newRegister = false;
      }
    });

    this.createReactiveForm()
    this.setType();
  }

  ngOnInit() {
  }

  setType() {
    const nav = this.router.getCurrentNavigation();
    if (nav != null) {
      if (nav.extras.state != undefined) {
        this.createReactiveForm()
        this.setPaymentTerm(nav.extras.state)
      }
    }
  }

  setPaymentTerm(paymentTerm: any) {
    this.validForm.get('description')?.setValue(paymentTerm.description)
    this.validForm.get('id')?.setValue(paymentTerm.id)
    this.validForm.get('codErp')?.setValue(paymentTerm.codErp)
  }

  createReactiveForm() {
    this.validForm = this.fb.group({
      id: ['',],
      description: ['', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(100)])],
      codErp: ['', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(12)])],
    });
  }

  saveForm() {
    if (this.validForm.valid) {
      this.setTypeReq()
    } else {
      const error: AllValidationErrors | any = getFormValidationErrors(this.validForm.controls).shift();
      if (error) {
        let text;
        let field = this.getField(error.control_name)

        switch (error.error_name) {
          case 'required': text = `${field} é obrigatória!`; break;
          case 'pattern': text = `${field} formato do campo errado!`; break;
          case 'minlength': text = `${field} tamanho inválido! Tamanho do campo é : ${error.error_value.requiredLength}`; break;
          default: text = `${field}: ${error.error_name}: ${error.error_value}`;
        }
        this.poNotification.error(text);
      }
      return;
    }
  }

  getField(field: string) {
    switch (field) {
      case 'description':
        return 'Descrição da condição de pagamento';
      case 'codErp':
        return 'Código ERP';
      default:
        return 'Código da condição de pagamento'
    }
  }

  setTypeReq() {
    this.newRegister ? this.postPaymentTerm() : this.putPaymentTerm();
  }

  postPaymentTerm() {
    this.cPService.postPaymentTerms(this.validForm.value).subscribe({
      next: data => {
        this.validForm.reset();
        this.poNotification.success(`Condição de pagamento ${data.description} incluida com sucesso.`);
      },
      error: error => {
        this.poNotification.error('Ops!! Ocorreu um erro.' + this.dataService.handleError(error));
      }
    });
  }

  putPaymentTerm() {
    this.cPService.putPaymentTerms(this.validForm.value).subscribe({
      next: data => {
        this.poNotification.success(`Condição de pagamento ${data.description} alterada com sucesso.`);
      },
      error: error => {
        this.poNotification.error('Ops!! Ocorreu um erro.' + this.dataService.handleError(error));
      }
    });
  }
}