import { Component, CUSTOM_ELEMENTS_SCHEMA, NgModule, OnInit, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { CondicaoPagamentoService } from './condicao-pagamento.service';
import { DataManipulation } from 'src/app/components/shared/shared-services.service';
import {
  PoBreadcrumb, PoButtonGroupItem, PoNotificationService, PoPageAction, PoTableColumn, PoTableComponent
} from '@po-ui/ng-components';

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
  selector: 'app-condicao-pagamento',
  templateUrl: './condicao-pagamento.component.html',
  providers: [CondicaoPagamentoService, DataManipulation],
  styleUrls: ['./condicao-pagamento.component.css']
})

export class CondicaoPagamentoComponent implements OnInit {
  @ViewChild(PoTableComponent, { static: true }) poTable!: PoTableComponent;

  searchPage: number = 1;
  searchLastPage: number = 0;
  searchNext: boolean = false;
  page: number = 1;
  lastPage: number = 0;
  hasNext: boolean = false;
  pagination: Array<PoButtonGroupItem> = [];
  searchParam: string = '';
  selectedPaymentTerm: Array<object> | any | [];
  paymentTerms: Array<object> | any | [];
  aprovarProcessesColumns: Array<PoTableColumn> | any;

  public readonly actions: Array<PoPageAction> = [
    { label: 'Cadastrar', action: this.registerPaymentTerms.bind(this), icon: 'po-icon-plus' },
    { label: 'Editar', icon: 'po-icon po-icon-edit', action: this.editPaymentTerms.bind(this) },
    { label: 'Excluir', action: this.deletePaymentTerms.bind(this) },
  ];

  public readonly breadcrumb: PoBreadcrumb = {
    items: [{ label: 'Condição de pagamento', link: '/condicao-pagamento' }, { label: 'listagem condição de pagamento' }]
  };

  constructor(
    private sampleAprovarProcessesService: CondicaoPagamentoService,
    private dataService: DataManipulation,
    private router: Router,
    private poNotification: PoNotificationService
  ) { }

  ngOnInit() {
    this.allPaymentTerms(1);
    this.aprovarProcessesColumns = this.sampleAprovarProcessesService.getColumns();
  }

  buttonsPage() {
    return [
      { label: '', icon: 'po-icon-arrow-left', action: this.onAnterior.bind(this), disabled: this.disablePageButton('prev') },
      { label: '', icon: 'po-icon-arrow-right', action: this.onProximo.bind(this), disabled: this.disablePageButton('next') },
    ];
  }

  allPaymentTerms(page: number) {
    this.dataService.getAllPageData(page, 'condicaoPagamento').subscribe({
      next: paymentTerm => {
        this.paymentTerms = paymentTerm;
        this.hasNext = false;
        if (this.paymentTerms?.next) {
          this.hasNext = true
        }
        this.pagination = this.buttonsPage();
      },
      error: error => {
        if (error.status == 404) {
          this.onAnterior();
        } else {
          this.poNotification.error('Ops!! Ocorreu um erro no cadastro da condição de pagamento.')
        }
      }
    })
  }

  editPaymentTerms() {
    var selectedItens = this.poTable.getSelectedRows()
    if (selectedItens.length > 0) {
      this.dataService.getSingleData(selectedItens[0].id, 'condicaoPagamento').subscribe(paymentTerm => {
        this.router.navigateByUrl('/cadastro-condicao-pagamento/' + selectedItens[0].id, {
          state: paymentTerm
        });
      })
    } else {
      this.poNotification.error("Escolha uma condição de pagamento para edição")
    }
  }

  deletePaymentTerms() {
    var selectedItens = this.poTable.getSelectedRows()
    if (selectedItens.length > 0) {
      this.dataService.deleteData(selectedItens[0].id, 'condicaoPagamento').subscribe({
        next: data => {
          this.poNotification.success("Condição de pagamento excluida com sucesso")
          if (this.searchParam != '') {
            this.onPesquisar(this.searchParam, false)
          } else {
            this.allPaymentTerms(this.page)
          }
        },
        error: error => {
          this.poNotification.error("Ocorreu um problema na exclusão")
          if (this.searchParam != '') {
            this.onPesquisar(this.searchParam, false)
          } else {
            this.allPaymentTerms(this.page)
          }
        }
      })
    } else {
      this.poNotification.error("Escolha uma condição de pagamento para exclusão")
    }
  }

  private registerPaymentTerms() {
    this.router.navigate(['/cadastro-condicao-pagamento/0']);
  }

  onProximo() {
    if (this.searchParam != '') {
      this.searchLastPage = this.searchPage
      this.searchPage++
      this.onPesquisar(this.searchParam, false)

    } else {
      this.allPaymentTerms(this.page + 1)
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
      this.allPaymentTerms(this.lastPage)
      this.page = this.lastPage
      this.lastPage--
    }
  }

  onPesquisar(searchParam: string, isSearch: boolean) {
    if (this.searchParam == '') {
      this.allPaymentTerms(this.page)
    } else {
      this.dataService.searchData(this.searchPage, searchParam, 'condicaoPagamento').subscribe({
        next: data => {
          if (data.results.length == 0) {
            this.searchParam = ''
            this.allPaymentTerms(this.page)
            this.poNotification.error('Não foi encontrado nenhuma condição de pagamento')
          } else {
            //resetar paginas caso filtre
            this.page = 1
            this.lastPage = 0
            this.hasNext = false

            this.paymentTerms = data

            //ajustar busca com paginacao
            this.searchNext = false;
            if (this.paymentTerms?.next) {
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
            this.poNotification.error('Ops!! Ocorreu um erro no mecanismo de busca da condição de pagamento.')
            this.searchPage = 1
            this.searchLastPage = 0
            this.searchNext = false
            this.allPaymentTerms(this.page)
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
}
