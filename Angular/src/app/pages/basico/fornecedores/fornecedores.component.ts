import { Component, CUSTOM_ELEMENTS_SCHEMA, NgModule, OnInit, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { FornecedoresService, SupplierDataManipulation } from './fornecedores.service';
import { DataManipulation } from 'src/app/components/shared/shared-services.service';
import {
  PoBreadcrumb, PoNotificationService, PoTableColumn,
  PoTableComponent, PoButtonGroupItem, PoPageAction, PoPageDefaultLiterals
} from '@po-ui/ng-components';
import { EsqueciSenhaServiceService } from 'src/app/components/esqueci-senha/esqueci-senha-service.service';
import { AuthService } from 'src/app/components/shared/auth/auth.service';

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
  selector: 'app-fornecedores',
  templateUrl: './fornecedores.component.html',
  providers: [FornecedoresService, SupplierDataManipulation, DataManipulation, EsqueciSenhaServiceService],
  styleUrls: ['./fornecedores.component.css']
})
export class FornecedoresComponent implements OnInit {
  @ViewChild(PoTableComponent, { static: true }) poTable!: PoTableComponent;

  sendEmailTo: string = '';
  sendEmailClicked: boolean = false;
  styleModal: string = 'position: fixed; top: 50%; right: 35%;'
  typeSupplier: string = "";
  filterSupplier: number = 0;
  searchPage: number = 1;
  searchLastPage: number = 0;
  searchNext: boolean = false;
  page: number = 1;
  lastPage: number = 0;
  hasNext: boolean = false;
  paginacao: Array<PoButtonGroupItem> = [];
  searchParam: string = '';
  selectedSupplier: Array<object> | any | [];
  suppliers: Array<object> | any | [];
  aprovarProcesses: Array<object> | any;
  supllierColumns: Array<PoTableColumn> | any;
  userType: string = this.authService.userType();

  public literalsDefault: PoPageDefaultLiterals = {
    otherActions: 'Mais ações'
  }

  public readonly actions: Array<PoPageAction> = [
    { label: 'Novo', action: this.onClickCadastrar.bind(this), icon: 'po-icon-plus' },
    { label: 'Editar', action: this.onClickEditar.bind(this) },
    { label: 'Excluir', action: this.onClickExcluir.bind(this), icon: 'po-icon-minus' },
    { label: 'Alterar status', action: this.approveSupplier.bind(this), icon: 'po-icon-change' },
    { label: 'Nova senha', action: this.newPass.bind(this), disabled: this.disablePageButton('pass'), icon: 'po-icon-lock-off' },
    { label: 'Enviar convite cadastro', action: this.openModal.bind(this), icon: 'po-icon-mail' },
  ];

  public readonly supplierActions: Array<PoPageAction> = [
    { label: 'Aprovados', action: this.filterStatus.bind(this, 1), icon: 'po-icon po-icon-ok' },
    { label: 'Reprovados', action: this.filterStatus.bind(this, 1), icon: 'po-icon po-icon-close' },
    { label: 'Aguardando', action: this.filterStatus.bind(this, 1), icon: 'po-icon po-icon-clock' },
  ];

  public readonly breadcrumb: PoBreadcrumb = {
    items: [{ label: 'Fornecedor', link: '/fornecedores' }, { label: 'Listagem de Fornecedor' }]
  };

  buttonsPage() {
    return [
      { label: '', icon: 'po-icon-arrow-left', action: this.onAnterior.bind(this), disabled: this.disablePageButton('prev') },
      { label: '', icon: 'po-icon-arrow-right', action: this.onProximo.bind(this), disabled: this.disablePageButton('next') },
    ];
  }

  constructor(
    private sampleAprovarProcessesService: FornecedoresService,
    private dataService: DataManipulation,
    private authService: AuthService,
    private poNotification: PoNotificationService,
    private router: Router,
    private sService: SupplierDataManipulation,
    private passService: EsqueciSenhaServiceService,
  ) { }

  ngOnInit() {
    this.allSuppliers(1);
    this.paginacao = this.buttonsPage();
    this.supllierColumns = this.sampleAprovarProcessesService.getColumns();
  }

  approveSupplier() {
    var selectedItens = this.poTable.getSelectedRows()
    let updatedStatus: number = 2;
    if (selectedItens[0].approve == 2) {
      updatedStatus = 1
    }
    if (selectedItens.length > 0) {
      this.sService.approvedSupllier(selectedItens[0].id, updatedStatus).subscribe({
        next: data => {
          this.poNotification.success('Status alterado com sucesso')
          if (this.searchParam != "") {
            this.onPesquisar(this.searchParam, false);
          } else {
            this.allSuppliers(this.page);
          }
        },
        error: error => {
          this.poNotification.error('Ops!! Ocorreu um erro no cadastro do fornecedor.')
        }
      })
    } else {
      this.poNotification.warning('Selecione um fornecedor para alterar o status.')
    }
  }

  filterStatus(page: number, status: any) {
    if (status.label == ('Aprovados')) {
      this.typeSupplier = status.label
      this.filterSupplier = 1
      this.getFilteredSupplier(page, 1)
    } else if (status.label == ('Reprovados')) {
      this.filterSupplier = 2
      this.getFilteredSupplier(page, 2)
    } else {
      this.getFilteredSupplier(page, 3)
      this.filterSupplier = 3
    }
  }

  getFilteredSupplier(page: number, status: number) {
    this.sService.filteredSuppliers(page, status).subscribe({
      next: supplier => {
        this.suppliers = supplier;
        this.hasNext = false;
        if (this.suppliers?.next) {
          this.hasNext = true;
        }
        this.paginacao = this.buttonsPage();
      },
      error: error => {
        if (error.status == 404) {
          this.onAnterior();
        } else {
          this.poNotification.error('Ops!! Ocorreu um erro no cadastro do fornecedor.')
        }
      }
    })
  }

  onClickEditar() {
    var selectedItens = this.poTable.getSelectedRows()
    if (selectedItens.length > 0) {
      this.dataService.getSingleData(selectedItens[0].id, 'fornecedores').subscribe(supplier => {
        this.router.navigateByUrl('/cadastro-fornecedor/99', {
          state: supplier
        });
      })
    } else {
      this.poNotification.error('Selecione um fornecedor ')
    }
  }

  newPass() {
    var selectedItens = this.poTable.getSelectedRows()
    if (selectedItens.length > 0) {
      this.dataService.getSingleData(selectedItens[0].id, 'fornecedores').subscribe(supplier => {
        this.passService.resetPass(supplier.user).subscribe({
          next: data => {
            this.poNotification.success('Nova senha enviada para o email do fornecedor')
          },
          error: error => {
            this.poNotification.error('Erro ao enviar nova senha')
          }
        })
      });
    } else {
      this.poNotification.error('Selecione um fornecedor ')
    }
  }

  allSuppliers(page: number) {
    this.dataService.getAllPageData(page, 'fornecedores').subscribe({
      next: supplier => {
        this.suppliers = supplier;
        this.hasNext = false;
        if (this.suppliers?.next) {
          this.hasNext = true;
        }
        this.paginacao = this.buttonsPage();
      },
      error: error => {
        if (error.status == 404) {
          this.onAnterior();
        } else {
          this.poNotification.error('Ops!! Ocorreu um erro no cadastro do fornecedor.')
        }
      }
    })
  }

  onClickExcluir() {
    var selectedItens = this.poTable.getSelectedRows()
    this.dataService.deleteData(selectedItens[0].id, 'fornecedores').subscribe({
      next: data => {
        this.poNotification.success('Fornecedor excluído com sucesso')
        if (this.searchParam != '') {
          this.onPesquisar(this.searchParam, false)
        } else {
          this.allSuppliers(this.page)
        }
        if (data.next == null) {
          this.hasNext = false
          this.page = 1
        } else if (data.previous == null) {
          this.lastPage = 0
        }
      },
      error: error => {
        this.poNotification.error('Ops!! Ocorreu um erro no cadastro do fornecedor.')
        if (this.searchParam != '') {
          this.onPesquisar(this.searchParam, false)
        } else {
          this.allSuppliers(this.page)
        }
      }
    })
  }

  onClickCadastrar() {
    this.router.navigate(['/cadastro-fornecedor/99']);
  }

  openModal() {
    this.sendEmailClicked = true;
  }

  sendEmail() {
    const data={
      email: this.sendEmailTo
    }
    this.dataService.genericEmail(data).subscribe({
      next: data => {
        this.poNotification.success('Convite enviado com sucesso!')
        this.sendEmailClicked = false;
      },
      error: error => {
        this.poNotification.error('Convite não enviado!')
      }
    })
  }

  onProximo() {
    if (this.searchParam != '') {
      this.filterSupplier = 0
      this.searchLastPage = this.searchPage
      this.searchPage++
      this.onPesquisar(this.searchParam, false)

    } else if (this.filterSupplier != 0) {
      this.filterStatus(this.page + 1, this.typeSupplier)
      this.lastPage = this.page
      this.page++
    } else {
      this.filterSupplier = 0
      this.allSuppliers(this.page + 1)
      this.lastPage = this.page
      this.page++
    }
  }

  onAnterior() {
    if (this.searchParam != '') {
      this.filterSupplier = 0
      this.searchPage = this.searchLastPage
      this.searchLastPage--
      this.onPesquisar(this.searchParam, false)
    } else if (this.filterSupplier != 0) {
      this.filterStatus(this.lastPage, this.typeSupplier)
      this.page = this.lastPage
      this.lastPage--
    } else {
      this.filterSupplier = 0
      this.allSuppliers(this.lastPage)
      this.page = this.lastPage
      this.lastPage--
    }
  }

  onPesquisar(searchParam: string, isSearch: boolean) {
    if (this.searchParam == '') {
      this.allSuppliers(this.page)
    } else {
      this.dataService.searchData(this.searchPage, searchParam, 'fornecedores').subscribe({
        next: data => {
          if (data.results.length == 0) {
            this.searchParam = ''
            this.allSuppliers(this.page)
            this.poNotification.error('Não foi encontrado nenhum fornecedor')
          } else {
            //resetar paginas caso filtre
            this.page = 1
            this.lastPage = 0
            this.hasNext = false

            this.suppliers = data

            //ajustar busca com paginacao
            this.searchNext = false;
            if (this.suppliers?.next) {
              this.searchNext = true
            }
            if (isSearch) {
              this.poNotification.success('Busca concluida')
            }
            this.paginacao = this.buttonsPage();
          }
        },
        error: error => {
          if (error.status == 404) {
            this.onAnterior();
          } else {
            this.poNotification.error('Ops!! Ocorreu um erro no mecanismo de busca do fornecedor.')
            this.searchPage = 1
            this.searchLastPage = 0
            this.searchNext = false
            this.allSuppliers(this.page)
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
    } else if (button == 'pass' && this.userType != 'adm') {
      return true
    }
    return false
  }
}