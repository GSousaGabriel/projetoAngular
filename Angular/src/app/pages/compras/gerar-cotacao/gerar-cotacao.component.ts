import { Component, CUSTOM_ELEMENTS_SCHEMA, NgModule, OnInit, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { GerarCotacaoService, PatchSolicitacao } from './gerar-cotacao.service';
import { DataManipulation } from 'src/app/components/shared/shared-services.service';

import {
  PoBreadcrumb, PoButtonGroupItem, PoNotificationService, PoPageAction, PoPageDefaultLiterals, PoTableColumn, PoTableComponent
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
  selector: 'app-gerar-cotacao',
  templateUrl: './gerar-cotacao.component.html',
  styleUrls: ['./gerar-cotacao.component.css'],
  providers: [GerarCotacaoService, DataManipulation, PatchSolicitacao]
})
export class GerarCotacaoComponent implements OnInit {
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
  aprovarProcessesColumns: Array<PoTableColumn> | any;

  public literalsDefault: PoPageDefaultLiterals = {
    otherActions: 'Mais ações'
  }

  public readonly actions: Array<PoPageAction> = [
    { label: 'Cadastrar', action: this.registerQuotation.bind(this), icon: 'po-icon-plus' },
    { label: 'Editar', icon: 'po-icon po-icon-edit', action: this.editQuotation.bind(this) },
    { label: 'Excluir', action: this.deleteQuotation.bind(this), icon: 'po-icon-minus' },
    { label: 'Enviar Email', action: this.sendEmail.bind(this), icon: 'po-icon po-icon-mail' },
  ];

  public readonly breadcrumb: PoBreadcrumb = {
    items: [{ label: 'Cotação', link: 'gerar-cotacao' }, { label: 'Listagem de cotações' }]
  };

  constructor(
    private cService: GerarCotacaoService,
    private dataService: DataManipulation,
    private router: Router,
    private poNotification: PoNotificationService,
    private patchService: PatchSolicitacao
  ) { }

  ngOnInit() {
    this.allQuotations(1);
    this.aprovarProcessesColumns = this.cService.getColumns();
  }

  buttonsPage() {
    return [
      { label: '', icon: 'po-icon-arrow-left', action: this.onAnterior.bind(this), disabled: this.disablePageButton('prev') },
      { label: '', icon: 'po-icon-arrow-right', action: this.onProximo.bind(this), disabled: this.disablePageButton('next') },
    ];
  }

  allQuotations(page: number) {
    this.dataService.getAllPageData(page, 'cotacaoCompra').subscribe({
      next: quotation => {
        this.quotations = quotation;
        this.hasNext = false;
        if (this.quotations?.next) {
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

  editQuotation() {
    var selectedItens = this.poTable.getSelectedRows()
    if (selectedItens.length > 0) {

      if (selectedItens[0].status != 3) {
        this.poNotification.error("Esta cotação já está resolvida!")
        return;
      }

      this.dataService.getSingleData(selectedItens[0].cotacaoId, 'cotacaoCompra').subscribe(quotation => {
        this.router.navigateByUrl('/cadastro-gerar-cotacao/' + selectedItens[0].cotacaoId, {
          state: quotation
        });
      })
    } else {
      this.poNotification.error("Escolha uma cotação de compra para edição")
    }
  }

  deleteQuotation() {
    var selectedItens = this.poTable.getSelectedRows()
    if (selectedItens.length > 0) {

      if (selectedItens[0].status != 3) {
        this.poNotification.error("Esta cotação já está resolvida!")
        return;
      }
      
      this.dataService.deleteData(selectedItens[0].cotacaoId, 'cotacaoCompra').subscribe({
        next: data => {

          //fix solicitacao
          this.fixSolicitacao(selectedItens[0].solicitacaoCotacao)

          //Delete itens
          for (var i = 0; selectedItens[0].itens.length > i; i++) {
            this.dataService.deleteData(selectedItens[0].itens[i].id, 'itemCotacao').subscribe({
              next: data => {
                console.log(data)
              },
              error: error => {
                console.log(error)
              }
            })
          }

          if (this.searchParam != '') {
            this.onPesquisar(this.searchParam, false)
          } else {
            this.allQuotations(this.page)
          }
          this.poNotification.success("Cotação excluida com sucesso!")
        },
        error: error => {
          this.poNotification.error("Ocorreu um problema na exclusão")
          if (this.searchParam != '') {
            this.onPesquisar(this.searchParam, false)
          } else {
            this.allQuotations(this.page)
          }
          this.poNotification.success("Cotação de compra excluida com sucesso")
        }
      })
    } else {
      this.poNotification.error("Escolha uma cotação de compra para exclusão")
    }
  }

  private fixSolicitacao(id: string){
    this.patchService.patchSolicitacao(id).subscribe()
  }

  private registerQuotation() {
    this.router.navigate(['/cadastro-gerar-cotacao/0']);
  }

  private sendEmail() {
    var selectedItens = this.poTable.getSelectedRows()
    if (selectedItens.length > 0) {
      this.poNotification.warning("Email sendo enviado...")
      this.dataService.sendEmail(selectedItens[0].cotacaoId, 'cotacaoCompraView').subscribe({
        next: quotation => {
          this.poNotification.success("Email enviado com sucesso!")
        },
        error: error => {
          this.poNotification.error("Email não enviado!")
        }
      })
    } else {
      this.poNotification.error("Escolha uma cotação para enviar os emails")
    }
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
}
