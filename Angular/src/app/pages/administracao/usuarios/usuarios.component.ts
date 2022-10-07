import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { PoBreadcrumb, PoButtonGroupItem, PoDialogService, PoNotificationService, PoPageAction, PoSelectOption, PoTableColumn, PoTableComponent } from '@po-ui/ng-components';
import { DataManipulation } from 'src/app/components/shared/shared-services.service';
import { UsuariosService } from './usuarios.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css'],
  providers: [UsuariosService, DataManipulation]
})
export class UsuariosComponent implements OnInit {
  @ViewChild(PoTableComponent, { static: true }) poTable!: PoTableComponent;

  searchPage: number = 1;
  searchLastPage: number = 0;
  searchNext: boolean = false;
  page: number = 1;
  lastPage: number = 0;
  hasNext: boolean = false;
  pagination: Array<PoButtonGroupItem> = [];
  searchParam: string = '';
  usuariosColunas: Array<PoTableColumn> = [];
  usuarios: Array<object> | any | [];

  public readonly breadcrumb: PoBreadcrumb = {
    items: [{ label: 'Usuários', link: 'usuarios' }, { label: 'Usuários' }]
  };

  public readonly actions: Array<PoPageAction> = [
    { label: 'Novo', action: this.onClickCadastrar.bind(this), icon: 'po-icon-plus' },
    { label: 'Editar', icon: 'po-icon po-icon-edit', action: this.onClickEditar.bind(this) },
  ];

  constructor(private poNotification: PoNotificationService,
    private dataService: DataManipulation,
    private poDialog: PoDialogService,
    private router: Router,
    private fService: UsuariosService) { }

  ngOnInit(): void {
    this.listAll(1);
    this.usuariosColunas = this.fService.getColumns();
  }

  buttonsPage() {
    return [
      { label: '', icon: 'po-icon-arrow-left', action: this.onAnterior.bind(this), disabled: this.disablePageButton('prev') },
      { label: '', icon: 'po-icon-arrow-right', action: this.onProximo.bind(this), disabled: this.disablePageButton('next') },
    ];
  }

  listAll(page: number) {
    this.dataService.getAllPageData(page, 'usuarios').subscribe({
      next: users => {
        this.usuarios = users
        this.hasNext = false;
        if (this.usuarios?.next) {
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

  onClickCadastrar() {
    this.router.navigate(['/cadastro-usuario/0']);
  }

  onClickEditar() {
    var selectedItens = this.poTable.getSelectedRows()
    if (selectedItens.length > 0) {
      this.dataService.getSingleData(selectedItens[0].id, 'usuarios').subscribe(usuario => {
        this.router.navigateByUrl(`/cadastro-usuario/${selectedItens[0].id}`, {
          state: usuario
        });
      })
    } else {
      this.poNotification.error("Escolha um usuário.")
    }


  }

  onProximo() {
    if (this.searchParam != '') {
      this.searchLastPage = this.searchPage
      this.searchPage++
      this.onPesquisar(this.searchParam, false)

    } else {
      this.listAll(this.page + 1)
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
      this.listAll(this.lastPage)
      this.page = this.lastPage
      this.lastPage--
    }
  }

  onPesquisar(searchParam: string, isSearch: boolean) {
    if (this.searchParam == '') {
      this.listAll(this.page)
    } else {
      this.dataService.searchData(this.searchPage, searchParam, 'usuarios').subscribe(data => {
        if (data.results.length == 0) {
          this.listAll(this.page)
          this.searchParam = ''
          this.poNotification.error('Não foi encontrado nenhum usuário')
        } else {
          //resetar paginas caso filtre
          this.page = 1
          this.lastPage = 0
          this.hasNext = false

          this.usuarios = data

          //ajustar busca com paginacao
          this.searchNext = false;
          if (this.usuarios?.next) {
            this.searchNext = true
          }
          if (isSearch) {
            this.poNotification.success('Busca concluida')
          }
          this.pagination = this.buttonsPage();
        }
      },
        error => {
          if (error.status == 404) {
            this.onAnterior();
          } else {
            this.poNotification.error('Ops!! Ocorreu um erro no mecanismo de busca do usuário.')
            this.searchPage = 1
            this.searchLastPage = 0
            this.searchNext = false
            this.listAll(this.page)
          }
        }
      )
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
