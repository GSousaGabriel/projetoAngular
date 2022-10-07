import { LookupGetUser } from './../../../../components/shared/shared-services.service';
import { ModeloProduto } from './../../../interfaces/produtos-cadastro-compras-json';
import { CadastroSolicitarComprasService, PostPurchaseOrders, OptionLookupFilter, UpdateObservation } from './cadastro-solicitar-compras.service';
import { DataManipulation } from 'src/app/components/shared/shared-services.service';
import { PoBreadcrumb, PoDynamicFormValidation, PoLookupLiterals, PoSelectOption, PoTableAction, PoTableColumn } from '@po-ui/ng-components';
import { Router, ActivatedRoute } from '@angular/router';
import { UntypedFormBuilder, UntypedFormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { Component, CUSTOM_ELEMENTS_SCHEMA, NgModule, OnInit, ViewChild } from '@angular/core';
import { AllValidationErrors, getFormValidationErrors } from 'src/app/components/shared/validador/get-form-validation-errors';
import { PoNotificationService, PoTableComponent, } from '@po-ui/ng-components';
import { AuthService } from 'src/app/components/shared/auth/auth.service';

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class CustomModule { }

@Component({
  selector: 'app-cadastro-solicitar-compras',
  templateUrl: './cadastro-solicitar-compras.component.html',
  styleUrls: ['./cadastro-solicitar-compras.component.css'],
  providers: [CadastroSolicitarComprasService, PostPurchaseOrders, UpdateObservation, OptionLookupFilter, DataManipulation, LookupGetUser]
})

export class CadastroSolicitarComprasComponent implements OnInit {
  @ViewChild(PoTableComponent, { static: true })
  poTable!: PoTableComponent;


  pageTitle: string = 'Nova solicitação de compra';
  integratedOrder: boolean = false;
  validForm!: UntypedFormGroup;
  typeCad!: string;
  newRegister: boolean = true;
  addedItem: boolean = false;
  itensOrder: Array<ModeloProduto> = [];
  aprovarProcessesColumns: Array<PoTableColumn> | any;
  customLiterals: PoLookupLiterals = {
    modalPrimaryActionLabel: 'Confirmar',
    modalSecondaryActionLabel: 'Cancelar',
    modalPlaceholder: 'Buscar',
    modalTableLoadingData: 'Carregando resultados',
    modalTableLoadMoreData: 'Carregar mais',
    modalTitle: 'Selecione o produto',
    modalDisclaimerGroupTitle: 'resultados da busca por:'
  };
  public readonly columnsUser = this.registerService.getColumnsLookup('requester');
  public readonly columnsProducts = this.registerService.getColumnsLookup('product');
  public readonly optionsCurrency = this.registerService.optionsCurrency();

  public readonly breadcrumb: PoBreadcrumb = {
    items: [{ label: 'Listagem de solicitações de compra', link: '/solicitar-compras' }, { label: 'Manutenção de solicitações de compra' }]
  };

  readonly optionsBranch: Array<PoSelectOption> = [
    { label: '', value: "" },
    { label: 'Campinas', value: "0102" },
    { label: 'Recife', value: '0101' },
    { label: 'Manaus', value: '0103' }
  ];

  constructor(
    private fb: UntypedFormBuilder,
    private router: Router,
    private registerService: CadastroSolicitarComprasService,
    private dataService: DataManipulation,
    public poNotification: PoNotificationService,
    private sCService: PostPurchaseOrders,
    private uObservation: UpdateObservation,
    public pOService: OptionLookupFilter,
    public userService: LookupGetUser,
    private route: ActivatedRoute,
    private authService: AuthService,
  ) {
    this.route.params.subscribe(params => {
      if (params['id'] != '0') {
        this.pageTitle = "Editar solicitação de compra"
        this.newRegister = false;
      }
    });

    this.createReactiveForm()
    this.validForm.get('issueDate')?.setValue(this.currentDate())
    this.validForm.get('requester')?.setValue(this.authService.getIdUser())
    this.setType();
  }

  ngOnInit() {
    this.aprovarProcessesColumns = this.registerService.getColumns();
  }

  setupPurchaseOrder(purchaseOrder: any) {
    this.validForm.get('solicitacaoId')?.setValue(purchaseOrder.solicitacaoId)
    this.validForm.get('branch')?.setValue(purchaseOrder.branch)
    this.validForm.get('issueDate')?.setValue(purchaseOrder.issueDate)
    this.validForm.get('requester')?.setValue(purchaseOrder.requester)
    this.validForm.get('fluigNumber')?.setValue(purchaseOrder.fluigNumber)
    this.validForm.get('expenseTitle')?.setValue(purchaseOrder.expenseTitle)

    if (purchaseOrder.fluigNumber != '' && purchaseOrder.fluigNumber != 0) {
      this.integratedOrder = true;
    }
  }

  createReactiveForm() {
    this.validForm = this.fb.group({
      solicitacaoId: ['',],
      branch: ['', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(100)])],
      issueDate: ['', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(100)])],
      requester: ['', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(3)])],
      fluigNumber: [0],
      expenseTitle: [''],
    });
  }

  saveForm() {
    if (this.validForm.valid) {
      if (this.validTable()) {
        this.setTypeReq()
      }
    } else {
      const error: AllValidationErrors | any = getFormValidationErrors(this.validForm.controls).shift();
      if (error) {
        let text;
        let field = this.getField(error.control_name)

        switch (error.error_name) {
          case 'required': text = `${field} é obrigatório!`; break;
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
      case 'branch':
        return 'Filial';
      case 'issueDate':
        return 'Data de emissão';
      case 'requester':
        return 'Solicitante';
      default:
        return 'Código do solicitação'
    }
  }

  validTable() {
    if (this.itensOrder.length == 0) {
      this.poNotification.error('Não é possivel salvar a solicitação sem itens');
      return false
    } else {
      for (let index = 0; index < this.itensOrder.length; index++) {
        if (this.itensOrder[index].productCode == undefined || this.itensOrder[index].productCode == 0) {
          this.poNotification.error(`Selecione o produto do item ${this.itensOrder[index].item}!`);
          return false
        } else if (this.itensOrder[index].necessityDate == "") {
          this.poNotification.error(`Selecione a data de necessidade do item ${this.itensOrder[index].item}!`);
          return false
        } else if (this.itensOrder[index].unit == "") {
          this.poNotification.error(`Selecione a unidade do item ${this.itensOrder[index].item}!`);
          return false
        } else if (this.itensOrder[index].quantity == 0 || this.itensOrder[index].productCode == undefined) {
          this.poNotification.error(`Selecione a quantidade do item ${this.itensOrder[index].item}!`);
          return false
        }
      }
      return true
    }
  }

  deleteProduct() {
    var selectedItens = this.poTable.getSelectedRows()
    if (selectedItens[0].id != 0) {
      this.dataService.deleteData(selectedItens[0].id, 'itensSolicitacao').subscribe({
        next: data => {
          this.poNotification.success(`Produto exluido com sucesso!`);
        },
        error: error => {
          this.poNotification.error('Ops!! Ocorreu um erro.' + this.dataService.handleError(error));
        }
      });
    }
    this.removeItem(selectedItens[0]);
    this.fixItem();
  }

  removeItem(row: any) {
    this.poTable.removeItem(row)
    for (var i = 0; i < this.itensOrder.length; i++) {
      if (this.itensOrder[i] == row) {
        this.itensOrder.splice(i, 1);
        return
      }
    }
  }

  fixItem() {
    for (var i = 0; i < this.itensOrder.length; i++) {
      this.itensOrder[i].item = '00' + (i + 1)
    }
  }

  setCurrency(currentItem: any, currency: any) {
    for (var i = 0; i < this.itensOrder.length; i++) {
      if (this.itensOrder[i].item == currentItem) {
        this.itensOrder[i].currency = currency;
        return
      }
    }
  }

  addProduct() {
    this.addedItem = true
    this.itensOrder = [...this.itensOrder, this.newItem()];
  }

  newItem(): ModeloProduto {
    return {
      id: 0,
      item: '00' + (this.itensOrder.length + 1),
      productCode: 0,
      defaultSupplier: '',
      product: '',
      observation: '',
      necessityDate: '',//<any>this.necessityDate(),
      unit: '',
      quantity: 0,
      currency: 'BR'
    }
  }

  setupProduct(id: any, item: any) {
    if (this.newRegister || this.addedItem) {
      this.dataService.getSingleData(id, 'produto').subscribe(data => {
        for (let i = 0; i < this.itensOrder.length; i++) {
          if ((this.itensOrder[i].item == item) && (this.itensOrder[i].productCode == data.id)) {
            this.itensOrder[i].product = data.name;
            this.itensOrder[i].unit = data.unit;
            this.itensOrder[i].defaultSupplier = data.defaultSupplier;
            this.addedItem = false;
            return
          }
        }
      }
      )
    }
  }

  currentDate() {
    return new Date()
  }

  necessityDate() {
    let date = this.currentDate()
    //date.setDate(date.getDate() + 4)
    return date
  }

  onChangeFields(change: any): PoDynamicFormValidation {
    return {}
  }

  setTypeReq() {
    this.newRegister ? this.postPurchaseOrder() : this.putPurchaseOrder();
  }

  postPurchaseOrder() {
    this.sCService.postPurchaseOrders(this.validForm.value, this.itensOrder).subscribe({
      next: data => {
        this.validForm.reset();
        this.itensOrder = [];
        this.poNotification.success(`solicitação ${data.solicitacaoId} incluida com sucesso.`);
      },
      error: error => {
        this.poNotification.error('Ops!! Ocorreu um erro.' + this.dataService.handleError(error));
      }
    });
  };

  putPurchaseOrder() {
    this.sCService.putPurchaseOrders(this.validForm.value, this.itensOrder).subscribe({
      next: data => {
        this.poNotification.success(`solicitação ${data.solicitacaoId} alterada com sucesso.`);

        if (this.integratedOrder) {

          for (let i = 0; i < this.itensOrder.length; i++) {
            //recupera o item
            this.dataService.filteredData('itemCotacao', 'productCode', this.itensOrder[i].id.toString()).subscribe({
              next: data => {
                //atualiza observacao
                this.uObservation.updateQuotationObservation(data.results[0].id, this.itensOrder[i].observation).subscribe({
                  next: data => {
                    console.log(`solicitação ${data.solicitacaoId} alterada com sucesso.`);
                  },
                  error: error => {
                    console.log(this.dataService.handleError(error));
                  }
                });
              },
              error: error => {
                console.log(this.dataService.handleError(error));
              }
            });
          }
        }

      },
      error: error => {
        this.poNotification.error('Ops!! Ocorreu um erro.' + this.dataService.handleError(error));
      }
    });
  }

  setType() {
    const nav = this.router.getCurrentNavigation();
    if (nav != null) {
      if (nav.extras.state != undefined) {
        this.createReactiveForm()
        this.setupPurchaseOrder(nav.extras.state)
        this.itensOrder = nav.extras.state['itens']
      }
    }
  }
}