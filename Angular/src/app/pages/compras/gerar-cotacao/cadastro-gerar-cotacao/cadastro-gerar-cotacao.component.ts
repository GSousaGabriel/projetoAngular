import { formatDate } from '@angular/common';
import { PoBreadcrumb, PoComboComponent, PoTableColumn } from '@po-ui/ng-components';
import { Router, ActivatedRoute } from '@angular/router';
import { UntypedFormBuilder, UntypedFormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { Component, CUSTOM_ELEMENTS_SCHEMA, NgModule, OnInit, ViewChild } from '@angular/core';
import { CadastroGerarCotacaoService, PostQuotation, LookupFilterOptionOrder, LookupFilterOptionProduct } from './cadastro-gerar-cotacao.service';
import { DataManipulation } from 'src/app/components/shared/shared-services.service';
import { ModeloProduto } from 'src/app/pages/interfaces/produtos-cadastro-cotacao-json';
import { PoNotificationService, PoTableComponent } from '@po-ui/ng-components';
import { AllValidationErrors, getFormValidationErrors } from 'src/app/components/shared/validador/get-form-validation-errors';
import { LookupFilterSupplier } from 'src/app/pages/basico/fornecedores/fornecedores.service';

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class CustomModule { }

@Component({
  selector: 'app-cadastro-gerar-cotacao',
  templateUrl: './cadastro-gerar-cotacao.component.html',
  styleUrls: ['./cadastro-gerar-cotacao.component.css'],
  providers: [CadastroGerarCotacaoService, PostQuotation, DataManipulation, LookupFilterOptionOrder, LookupFilterOptionProduct, LookupFilterSupplier]
})

export class CadastroGerarCotacaoComponent implements OnInit {
  @ViewChild(PoTableComponent, { static: true })
  poTable!: PoTableComponent;

  pageTitle: string = 'Nova cotação de compra'
  validForm!: UntypedFormGroup;
  typeCad!: string;
  optionProducts: any;
  productsPurchase: any;
  allPaymentTerms: Array<PoComboComponent> | any;
  allProducts: Array<PoComboComponent> | any;
  newRegister = true;
  itensQuotation: Array<ModeloProduto> = [];
  aprovarProcessesColumns: Array<PoTableColumn> | any;

  public readonly columnsSupplier = this.cService.getColumnsLookup('supplier');
  public readonly columnsProduct = this.cService.getColumnsLookup('product');
  public readonly columnsOrder = this.cService.getColumnsLookup('order');

  public readonly breadcrumb: PoBreadcrumb = {
    items: [{ label: 'Listagem de cotaões de compra', link: '/gerar-cotacao' }, { label: 'Manutenção de cotações de compra' }]
  };

  constructor(
    private fb: UntypedFormBuilder,
    private router: Router,
    private cService: CadastroGerarCotacaoService,
    private dataService: DataManipulation,
    private route: ActivatedRoute,
    private pCService: PostQuotation,
    public poNotification: PoNotificationService,
    public gOIService: LookupFilterOptionOrder,
    public gPService: LookupFilterOptionProduct,
    public gSService: LookupFilterSupplier
  ) {
    this.route.params.subscribe(params => {
      if (params['id'] != '0') {
        this.pageTitle = "Editar cotação de compra"
        this.newRegister = false;
      }
    });

    this.createReactiveForm()
    this.validForm.get('issueDate')?.setValue(this.currentDate())
    this.setType();

  }

  ngOnInit() {
    this.aprovarProcessesColumns = this.cService.getColumns();
  }

  setupQuotation(purchaseOrder: any) {
    this.validForm.get('cotacaoId')?.setValue(purchaseOrder.cotacaoId)
    this.validForm.get('buyer')?.setValue(purchaseOrder.buyer)
    this.validForm.get('issueDate')?.setValue(purchaseOrder.issueDate)
    this.validForm.get('solicitacaoCotacao')?.setValue(purchaseOrder.solicitacaoCotacao)
  }

  fillQuotationData(purchaseOrder: number) {
    if (this.newRegister) {
      this.fillQuotation(purchaseOrder);
    }
  }

  fillQuotation(purchaseOrder: number) {
    this.itensQuotation = []

    this.dataService.getSingleData(purchaseOrder, 'solicitacaoCompraView').subscribe(options => {
      this.validForm.get('buyer')?.setValue(options.requester.username)
      this.validForm.get('fluigNumber')?.setValue(options.fluigNumber)
      this.validForm.get('expenseTitle')?.setValue(options.expenseTitle)
      for (let index = 0; index < options.itens.length; index++) {
        this.addProduct(options.itens[index].id)
      }
    })
  }

  fixValue(value: any, row: any) {
    if (value == "" || value == "NaN" || value == null) {
      value = '0,00'
    }
    value = value.toString()
    value = value.replace(/[^0-9.,]+/, '')
    value = parseFloat(value.replaceAll('.', '').replace(',', '.')).toFixed(2)
    return row.quantity = value.replace(".", ",")
  }

  createReactiveForm() {
    this.validForm = this.fb.group({
      cotacaoId: ['',],
      issueDate: ['', Validators.compose([Validators.required])],
      fluigNumber: ['',],
      expenseTitle: ['',],
      buyer: ['',],
      solicitacaoCotacao: ['', Validators.compose([Validators.required])],
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
      case 'solicitacaoCotacao':
        return 'Nr. Solicitação';
      case 'issueDate':
        return 'Data de emissão';
      default:
        return 'Código da cotação'
    }
  }

  validTable() {
    if (this.itensQuotation.length == 0) {
      this.poNotification.error('Não é possivel salvar a cotação sem itens');
      return false
    } else {
      for (let index = 0; index < this.itensQuotation.length; index++) {
        if (this.itensQuotation[index].productCode == undefined || this.itensQuotation[index].productCode == 0) {
          this.poNotification.error('Selecione o produto!');
          return false
        } else if (this.itensQuotation[index].supplierId == "") {
          this.poNotification.error('Selecione o fornecedor!');
          return false
        } else if (this.itensQuotation[index].quantity == '' || this.itensQuotation[index].productCode == undefined) {
          this.poNotification.error('Selecione a quantidade!');
          return false
        }
      }
      return true
    }
  }

  addProduct(productCode: number = 0) {
    this.itensQuotation = [...this.itensQuotation, this.newItem(productCode)];
  }

  newItem(productCode: number) {
    return {
      id: this.itensQuotation.length + 1,
      productCode: productCode,
      product: '',
      quotationId: 0,
      userId: 0,
      supplierId: '',
      unit: '',
      quotationQuantity: '0,00',
      quantity: '',
      observation: '',
      validDate: this.currentDate(),
      necessityDate: '',
      valueIPI: '0,00',
      unitValue: '0,00',
      totalQuotation: 0,
    }
  }

  currentDate() {
    return formatDate(new Date(), 'yyyy-MM-dd', 'en')
  }

  fillData(idRow: number, value: any, type: string, checkNew:string ='') {
    if (this.newRegister || (type== 'product' && checkNew== '') || type== 'supplier') {
      let link = 'itensSolicitacao'
      if (type == 'supplier') {
        link = 'fornecedores'
      }
      this.dataService.getSingleData(value, link).subscribe(data => {
        for (var i = 0; i < this.itensQuotation.length; i++) {
          if (type == 'product') {
            if ((idRow == this.itensQuotation[i].id) && (value == data.id)) {
              this.itensQuotation[i].quantity = data.quantity;
              this.itensQuotation[i].quotationQuantity = data.quantity;
              this.itensQuotation[i].necessityDate = data.necessityDate;
              this.itensQuotation[i].product = data.product;
              this.itensQuotation[i].unit = data.unit;
              this.itensQuotation[i].productCode = data.id;
              this.itensQuotation[i].observation = data.observation;
              if (this.newRegister) {
                this.itensQuotation[i].supplierId = data.defaultSupplier;
              }
              return
            }
          } else {
            this.itensQuotation[i].userId = data.user;
            return
          }
        }
      })
    }
  }

  setItemValue(idRow: number, value: any, fieldChange: string) {
    for (let index = 0; index < this.itensQuotation.length; index++) {
      if (this.itensQuotation[index].id == idRow) {
        this.itensQuotation[index][fieldChange] = value;
        return
      }
    }
  }

  deleteProduct() {
    var selectedItens = this.poTable.getSelectedRows()
    if (!this.newRegister) {
      this.dataService.deleteData(selectedItens[0].id, 'itemCotacao').subscribe({
        next: data => {
          this.poNotification.success(`Item excluido com sucesso.`);
        },
        error: error => {
          this.poNotification.error('Ops!! Ocorreu um erro.' + this.dataService.handleError(error));
        }
      });
    }
    this.removeProduct(selectedItens[0]);
    this.fixId(false)
  }

  removeProduct(item: any) {
    this.poTable.removeItem(item)
    for (var i = 0; i < this.itensQuotation.length; i++) {
      if (this.itensQuotation[i].id == item.id) {
        this.itensQuotation.splice(i, 1);
        return
      }
    }
  }

  fixId(post: boolean) {
    for (var i = 0; i < this.itensQuotation.length; i++) {
      if (post) {
        this.itensQuotation[i].id = 0
      } else {
        this.itensQuotation[i].id = i + 1
      }
    }
  }

  setTypeReq() {
    this.newRegister ? this.postQuotation() : this.putQuotation();
  }

  postQuotation() {
    this.fixId(true);
    this.pCService.postQuotations(this.validForm.value, this.itensQuotation).subscribe({
      next: data => {
        this.updatePurchaseOrder(data.solicitacaoCotacao)
        this.setQuotationId(data)
        this.validForm.reset();
        this.itensQuotation = [];
        this.poNotification.success(`Cotação ${data.cotacaoId} incluida com sucesso.`);
      },
      error: error => {
        this.poNotification.error('Ops!! Ocorreu um erro.' + this.dataService.handleError(error));
      }
    });
  };

  putQuotation() {
    this.pCService.putQuotations(this.validForm.value, this.itensQuotation).subscribe({
      next: data => {
        this.setQuotationId(data)
        this.poNotification.success(`Cotação ${data.cotacaoId} alterada com sucesso.`);
      },
      error: error => {
        this.poNotification.error('Ops!! Ocorreu um erro.' + this.dataService.handleError(error));
      }
    });
  }

  setQuotationId(data: any) {
    //atualiza valor nos itens
    for (let index = 0; index < data.itens.length; index++) {
      data.itens[index].quotationId = data.cotacaoId
    }

    //tratativa dos dados da cotacao
    this.pCService.updateItem(data.cotacaoId, data).subscribe({
      next: data => {
        console.log(data)
      },
      error: error => {
        console.log(error)
      }
    });
    //fim da tratativa
  }

  updatePurchaseOrder(purchaseOrderId: number) {

    this.pCService.updatePurchaseOrder(purchaseOrderId).subscribe({
      next: data => {
        console.log(data)
      },
      error: error => {
        console.log(error)
      }
    });
  }

  setType() {
    const nav = this.router.getCurrentNavigation();
    if (nav != null) {
      if (nav.extras.state != undefined) {

        this.createReactiveForm()
        this.setupQuotation(nav.extras.state)
        this.itensQuotation = nav.extras.state['itens']
      }
    }
  }
}