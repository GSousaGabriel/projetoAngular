import { Component, OnInit, ViewChild } from '@angular/core';
import { PoBreadcrumb, PoButtonGroupItem, PoNotificationService, PoSelectOption, PoTableColumn, PoTableComponent } from '@po-ui/ng-components';
import { AuthService } from 'src/app/components/shared/auth/auth.service';
import { DataManipulation } from 'src/app/components/shared/shared-services.service';
import { ComboFilterOption } from '../../basico/condicao-pagamento/condicao-pagamento.service';
import { LookupFilterOptionSupplier } from '../../basico/fornecedores/fornecedores.service';
import { AtualizaCotacaoService, HttpQuotation } from './atualiza-cotacao.service';

@Component({
  selector: 'app-atualiza-cotacao',
  templateUrl: './atualiza-cotacao.component.html',
  styleUrls: ['./atualiza-cotacao.component.css'],
  providers: [DataManipulation, AtualizaCotacaoService, ComboFilterOption, HttpQuotation, LookupFilterOptionSupplier]
})
export class AtualizaCotacaoComponent implements OnInit {
  @ViewChild(PoTableComponent, { static: true }) poTable!: PoTableComponent;

  searchPage: number = 1;
  searchLastPage: number = 0;
  searchNext: boolean = false;
  page: number = 1;
  lastPage: number = 0;
  hasNext: boolean = false;
  pagination: Array<PoButtonGroupItem> = [];
  searchParam: string = '';
  quotations: Array<object> | any | [];
  quotationColumns: Array<PoTableColumn> | any;
  itemColumns: Array<PoTableColumn> | any;
  userType: string = this.authService.userType();
  anexoCotacao!: ImageSnippet;
  anexoSelecionado: string= 'Nenhum arquivo selecionado';
  shipping: string= "";
  shippingValue: string= "";

  private currentUser = this.authService.getIdUser()
  private staff: any = this.isStaff()

  readonly shippingOptions: Array<PoSelectOption> = [
    { label: 'CIF', value: 'CIF' },
    { label: 'FOB', value: 'FOB' }
  ];

  public readonly breadcrumb: PoBreadcrumb = {
    items: [{ label: 'Analisa pedidos' }, { label: 'Registrar cotação' }]
  };

  constructor(
    private attService: AtualizaCotacaoService,
    private dataService: DataManipulation,
    private poNotification: PoNotificationService,
    public supplierService: LookupFilterOptionSupplier,
    public cFService: ComboFilterOption,
    private authService: AuthService,
    private requestService: HttpQuotation
  ) { }

  ngOnInit() {
    this.allQuotations(1);
    this.quotationColumns = this.attService.getColumns();
    this.itemColumns = this.attService.getColumnsItens(this.isStaff());
  }

  buttonsPage() {
    return [
      { label: '', icon: 'po-icon-arrow-left', action: this.onAnterior.bind(this), disabled: this.disablePageButton('prev') },
      { label: '', icon: 'po-icon-arrow-right', action: this.onProximo.bind(this), disabled: this.disablePageButton('next') },
    ];
  }

  isStaff() {
    if (this.userType == 'employee' || this.userType == 'adm') {
      return true
    }
    return false
  }

  allQuotations(page: number) {
    let results: any[] = [];

    this.requestService.filteredData(this.currentUser, page, this.userType).subscribe({
      next: quotation => {

        this.quotations = quotation.results;
        this.hasNext = false;
        if (quotation?.next) {
          this.hasNext = true
        }
        this.pagination = this.buttonsPage();
      },
      error: error => {
        if (error.status == 404) {
          this.onAnterior();
        } else {
          this.poNotification.error('Ops!! Ocorreu um erro no cadastro da cotação de compra.')
        }
      }
    })
  }

  supplierItensFilter(itens: any, row: any) {
    let currentUser = this.authService.getIdUser()
    let supplierItens = []

    for (let index = 0; index < itens.length; index++) {
      if (itens[index].userId == currentUser || this.staff) {
        supplierItens.push(itens[index])
       
        if(itens[index].shipping != '' && itens[index].shipping != null){
          this.shipping = itens[index].shipping
          this.shippingValue = itens[index].shippingValue
          row.shipping = itens[index].shipping
          row.shippingValue = itens[index].shippingValue
        }
      }
    }
    return supplierItens
  }

  setShipping(option: string, row: any) {
    this.shipping = option;
  }

  setPaymentTerm(option: string, row: any) {
    row.paymentTermsId = option
  }

  setTotal(unitValue: string, quotationQuantity: string, ipi: any, row: any) {
    unitValue = this.fixValue(unitValue)
    quotationQuantity = this.fixValue(quotationQuantity)
    ipi = this.fixValue(ipi)
    row.valueIPI = ipi

    let total: number = parseFloat(unitValue.replace(',', '.')) * parseFloat(quotationQuantity.replace(',', '.'))

    if (ipi != "" && ipi != null) {
      ipi = this.fixValue(ipi)
      ipi = parseFloat(ipi).toFixed(2)
      total = total + (total * (ipi / 100))
    }

    row.unitValue = unitValue
    row.quotationQuantity = quotationQuantity
    row.totalQuotation = total.toFixed(2)
    row.totalQuotation = this.fixValue(row.totalQuotation.replace('.', ','))
  }

  setShippingValue(value: string, row: any) {
    this.shippingValue= this.fixValue(value)
  }

  setICMSValue(value: string, row: any) {
    row.valueICMS = this.fixValue(value)
  }

  fixValue(value: any) {
    if (value == "" || value == "NaN" || value == null) {
      value = '0,00'
    }
    value = value.toString()
    value = value.replace(/[^0-9.,]+/, '')
    value = parseFloat(value.replaceAll('.', '').replace(',', '.')).toFixed(2)
    return value.replace(".", ",")
  }

  onProximo() {
    if (this.searchParam != '') {
      this.searchLastPage = this.searchPage
      this.searchPage++
      this.onPesquisar(this.searchParam, false)

    } else {
      this.allQuotations(this.page + 1)
      this.lastPage = this.page
      this.page++
    }
  }

  onAnterior() {
    if (this.searchParam != '') {
      this.searchPage = this.searchLastPage
      this.searchLastPage--
      this.onPesquisar(this.searchParam, false)
    } else {
      this.allQuotations(this.lastPage)
      this.page = this.lastPage
      this.lastPage--
    }
  }

  onPesquisar(searchParam: string, isSearch: boolean) {
    if (this.searchParam == '') {
      this.allQuotations(this.page)
    } else {
      this.dataService.searchData(this.searchPage, searchParam, 'cotacaoCompra').subscribe({
        next: data => {
          if (data.results.length == 0) {
            this.allQuotations(this.page)
            this.searchParam = ''
            this.poNotification.error('Não foi encontrado nenhuma cotação de compra')
          } else {
            //resetar paginas caso filtre
            this.page = 1
            this.lastPage = 0
            this.hasNext = false

            this.quotations = data

            //ajustar busca com paginacao
            this.searchNext = false;
            if (this.quotations?.next) {
              this.searchNext = true
            }
            if (isSearch) {
              this.poNotification.success('Busca concluida')
            }
            this.pagination = this.buttonsPage();
          }
        },
        error: error => {
          if (error.status == 404) {
            this.onAnterior();
          } else {
            this.poNotification.error('Ops!! Ocorreu um erro no mecanismo de busca da cotação de compra.')
            this.searchPage = 1
            this.searchLastPage = 0
            this.searchNext = false
            this.allQuotations(this.page)
          }
        }
      })
    }
  }

  disablePageButton(button: string) {
    let lastPage = this.lastPage
    let next = this.hasNext

    //modo com filtro
    if (this.searchParam != '') {
      lastPage = this.searchLastPage
      next = this.searchNext
    }

    if (button == 'prev' && lastPage == 0) {
      return true
    } else if (button == 'next' && !next) {
      return true
    }
    return false
  }

  validateFields(item: any) {
    if (item.unitValue == undefined || item.unitValue == 0) {
      this.poNotification.error('Preencha o valor unitário de todos os produtos!');
      return false
    } else if (item.validDate == "") {
      this.poNotification.error('Preencha a data de validade de todos os produtos!');
      return false
    } else if (item.quotationQuantity == "") {
      this.poNotification.error('Preencha a quantidade de todos os produtos!');
      return false
    } else if (item.paymentTermsId == null) {
      this.poNotification.error('Preencha a condição de pagamento!');
      return false
    }
    return true
  }

  saveItens(rowItem: any) {
    let currentUser = this.authService.getIdUser()
    let supplierId = 0

    if ((rowItem.shipping != "" && rowItem.shipping != null) && (rowItem.shippingValue == "" || rowItem.shippingValue == null)) {
      this.poNotification.error('Preencha o valor do Frete!');
      return
    }
    for (let index = 0; index < rowItem.itens.length; index++) {
      if (currentUser == rowItem.itens[index].userId || this.staff) {
        if (this.validateFields(rowItem.itens[index])) {
          rowItem.itens[index].approve = 4
          supplierId = rowItem.itens[index].supplierId
          rowItem.itens[index].attachment = this.anexoCotacao
          rowItem.itens[index].shipping = this.shipping
          rowItem.itens[index].shippingValue = this.shippingValue
          
          this.sendItem(rowItem.itens[index], supplierId, rowItem.cotacaoId)

        } else {
          return
        }
      }
    }
    this.calculateValue(rowItem.cotacaoId, rowItem)
  }

  sendItem(data: any, supplierId: number, cotacaoId: number){
    
    this.requestService.updateItem(data.id, data).subscribe({
      next: data => {
        this.allQuotations(this.page)
        this.poNotification.success('Alterações salvas com sucesso!')

        if (this.userType != 'adm') {
          this.poNotification.warning('Email sendo encaminhado...')
          this.requestService.sendEmailSupplier(cotacaoId, supplierId).subscribe({
            next: data => {
              this.poNotification.success('O email da sua cotação foi encaminhado com sucesso!')
            },
            error: error => {
              this.poNotification.error('O email da sua cotação não foi encaminado!')
            }
          })
        }

      },
      error: error => {
        this.poNotification.error('Ops!! Ocorreu um erro ao salvar as alterações.')
      }
    })
  }

  calculateValue(id: number, row: any){
    this.requestService.calculatePrice(id, row).subscribe({
      next: data => {
        console.log(data)
      },
      error: error => {
        console.log(error)
      }
    })
  }

  processFile(imageInput: any) {
    const file: File = imageInput.files[0];
    const reader = new FileReader();
    this.anexoSelecionado= file.name;
    reader.readAsDataURL(file);

    reader.addEventListener('load', (event: any) => {
      this.anexoCotacao = new ImageSnippet(event.target.result, file);  
    });
  }
}


class ImageSnippet {
  constructor(public src: string, public file: File ) {}
}
