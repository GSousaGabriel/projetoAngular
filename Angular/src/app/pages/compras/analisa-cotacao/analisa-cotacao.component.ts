import { formatDate } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { PoBreadcrumb, PoButtonGroupItem, PoNotificationService, PoTableColumn, PoTableComponent } from '@po-ui/ng-components';
import { AuthService } from 'src/app/components/shared/auth/auth.service';
import { DataManipulation } from 'src/app/components/shared/shared-services.service';
import { AnalisaCotacaoService, ApproveItemQuotation, HttpRequestQuotation } from './analisa-cotacao.service';

@Component({
  selector: 'app-analisa-cotacao',
  templateUrl: './analisa-cotacao.component.html',
  styleUrls: ['./analisa-cotacao.component.css'],
  providers: [DataManipulation, AnalisaCotacaoService, ApproveItemQuotation, HttpRequestQuotation]
})
export class AnalisaCotacaoComponent implements OnInit {
  @ViewChild(PoTableComponent, { static: true }) poTable!: PoTableComponent;

  searchPage: number = 1;
  searchLastPage: number = 0;
  searchNext: boolean = false;
  page: number = 1;
  lastPage: number = 0;
  hasNext: boolean = false;
  pagination: Array<PoButtonGroupItem> = [];
  searchParam: string = '';
  currentRow: any;
  quotations: Array<object> | any | [];
  quotationColumns: Array<PoTableColumn> | any;
  itemColumns: Array<PoTableColumn> | any;
  itens: any = [];
  descApproveReason: string = "";
  approveReason: boolean = false;
  styleReason: string = 'position: fixed; top: 50%; left: 50%;'
  updatedStatus: number = 2;

  private staff: any = this.isStaff()

  public readonly breadcrumb: PoBreadcrumb = {
    items: [{ label: 'Analisa cotação', link: 'analisa-cotacao' }, { label: 'Listagem de cotações' }]
  };

  constructor(
    private aQService: AnalisaCotacaoService,
    private dataService: DataManipulation,
    private hpptRequest: HttpRequestQuotation,
    private approveItemService: ApproveItemQuotation,
    private poNotification: PoNotificationService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.allQuotations(1);
    this.quotationColumns = this.aQService.getColumns();
    this.itemColumns = this.aQService.getColumnsItens();
  }

  isStaff() {
    let userType = this.authService.userType()

    if (userType == 'employee' || userType == 'adm') {
      return true
    }
    return false
  }

  buttonsPage() {
    return [
      { label: '', icon: 'po-icon-arrow-left', action: this.onAnterior.bind(this), disabled: this.disablePageButton('prev') },
      { label: '', icon: 'po-icon-arrow-right', action: this.onProximo.bind(this), disabled: this.disablePageButton('next') },
    ];
  }

  allQuotations(page: number) {
    this.hpptRequest.getAllFilteredPageData(page).subscribe({
      next: (quotation) => {
        this.quotations = quotation.results;
        this.hasNext = false;
        if (this.quotations?.next) {
          this.hasNext = true
        }
        this.pagination = this.buttonsPage();
      },
      error: (error) => {
        if (error.status == 404) {
          this.onAnterior();
        } else {
          this.poNotification.error('Ops!! Ocorreu um erro no cadastro da cotação de compra.')
        }
      }
    })
  }

  fillItens(quotations: any) {
    this.itens = []
    for (let index = 0; index < quotations.length; index++) {
      for (let i = 0; i < quotations[index].itens.length; i++) {

        if (quotations[index].itens[i].attachment != null && quotations[index].itens[i].attachment != '') {
          quotations[index].itens[i].hasAttachment = 'Visualizar anexo'
        }

        this.itens = [...this.itens, quotations[index].itens[i]];
      }
    }
    this.itens.sort(function (a: any, b: any) {
      return a.productCode - b.productCode;
    });
    return this.itens
  }

  approveItem(row: any, approve: boolean, type: string) {
    let showError = true;

    if (type == 'quotation') {
      this.updatedStatus = 3
    } else if (approve) {
      this.updatedStatus = 1
    } else if (!approve) {
      this.updatedStatus = 2
    }

    for (let i = 0; i < this.itens.length; i++) {
      if (type == 'quotation' && this.itens[i].approve != 3) {
        showError = false
        this.updateItem(row, 'quotation', true)
      } else if (type == 'quotation' && this.itens[i].approve == 3) {
        this.poNotification.error(`Produto ${row.itens[i].product} ainda está cotando!`)
        break;
      } else {
        if (this.itens[i]['$selected'] && this.itens[i].approve != 3) {
          showError = false

          if (this.itens[i].approve == 2 && !approve) {
            this.poNotification.error(`Produto ${row.itens[i].product} ja está reprovado!`)
            break;
          } else if (this.itens[i].approve == 1 && approve) {
            this.poNotification.error(`Produto ${row.itens[i].product} ja está aprovado!`)
            break;
          }
          this.approveReason = true
        } else if (row.cotacao[0].itens[i]['$selected'] && row.cotacao[0].itens[i].approve == 3) {
          this.poNotification.error(`Produto ${row.itens[i].product} ainda não foi cotado!`)
          return
        }
      }
    }
    if (showError) {
      this.poNotification.error('Selecione ao menos um produto!')
    }
  }

  updateItem(row: any, type: string, sendEmail: boolean = false) {
    for (let i = 0; i < this.itens.length; i++) {
      if (this.itens[i]['$selected']) {

        this.itens[i].approve = this.updatedStatus

        if (type == 'approve') {
          this.itens[i].approver = row.buyer
          this.itens[i].approveDate = formatDate(new Date(), "dd/MM/yyyy", 'en')
          this.itens[i].approveReason = this.descApproveReason
          this.updateQuotation(row.cotacao[0].cotacaoId, row.cotacao[0]);
        }

        this.approveItemService.approveItem(this.itens[i].id, this.itens[i], sendEmail).subscribe({
          next: (data) => this.poNotification.success('Status alterado com sucesso!'),
          error: (error) => this.poNotification.error('Ops!! Ocorreu um erro ao alterar o status.')
        });
      }
    }
    this.approveReason = false
  }

  resetSelected(itens: any) {
    for (let i = 0; i < itens.length; i++) {
      itens[i]['$selected']= false
    }
  }

  updateQuotation(id: number, quotation: any) {
    let status = 3

    for (let index = 0; index < quotation.itens.length; index++) {
      if (quotation.itens[index].approve != 3 && quotation.itens[index].approve != 4) {
        if (status != 3 && quotation.itens[index].approve == status) {
          continue
        } else if (status == 3) {
          status = quotation.itens[index].approve
        } else if (status != 3 && quotation.itens[index].approve != status) {
          status = 3
          break;
        }
      }
    }

    this.approveItemService.approveQuotation(id, status).subscribe({
      next: (data) => data /*this.poNotification.success('Status alterado com sucesso!')*/,
      error: (error) => error //this.poNotification.error('Ops!! Ocorreu um erro ao alterar o status.')
    });
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
