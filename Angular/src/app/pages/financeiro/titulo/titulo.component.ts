import { Component, CUSTOM_ELEMENTS_SCHEMA, NgModule, OnInit, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { DataManipulation } from 'src/app/components/shared/shared-services.service';
import {
  PoBreadcrumb, PoNotificationService, PoTableColumn,
  PoTableComponent, PoButtonGroupItem} from '@po-ui/ng-components';
import { TituloService } from './titulo.service';

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
  selector: 'app-titulo',
  templateUrl: './titulo.component.html',
  providers: [DataManipulation, TituloService],
  styleUrls: ['./titulo.component.css']
})
export class TituloComponent implements OnInit {
  @ViewChild(PoTableComponent, { static: true }) poTable!: PoTableComponent;

  searchPage: number = 1;
  searchLastPage: number = 0;
  searchNext: boolean = false;
  page: number = 1;
  lastPage: number = 0;
  hasNext: boolean = false;
  paginacao: Array<PoButtonGroupItem> = [];
  searchParam: string = '';
  titles: Array<object> | any | [];
  titlesColumns: Array<PoTableColumn> | any;

  public readonly breadcrumb: PoBreadcrumb = {
    items: [{ label: 'Titulos', link: '/titulos' }, { label: 'Listagem de titulos' }]
  };

  buttonsPage() {
    return [
      { label: '', icon: 'po-icon-arrow-left', action: this.onAnterior.bind(this), disabled: this.disablePageButton('prev') },
      { label: '', icon: 'po-icon-arrow-right', action: this.onProximo.bind(this), disabled: this.disablePageButton('next') },
    ];
  }

  constructor(
    private titleService: TituloService,
    private dataService: DataManipulation,
    private poNotification: PoNotificationService,
  ) { }

  ngOnInit() {
    this.allTitles(1);
    this.paginacao = this.buttonsPage();
    this.titlesColumns = this.titleService.getColumns();
  }

  allTitles(page: number) {
    this.dataService.getAllPageData(page, 'titulos').subscribe({
      next: title => {
        this.titles = title;
        this.hasNext = false;
        if (this.titles?.next) {
          this.hasNext = true;
        }
        this.paginacao = this.buttonsPage();
      },
      error: error => {
        if (error.status == 404) {
          this.onAnterior();
        } else {
          this.poNotification.error('Ops!! Ocorreu um erro no cadastro do titulo.')
        }
      }
    })
  }

  onProximo() {
    if (this.searchParam != '') {
      this.searchLastPage = this.searchPage
      this.searchPage++
      this.onPesquisar(this.searchParam, false)

    }else {
      this.allTitles(this.page + 1)
      this.lastPage = this.page
      this.page++
    }
  }

  onAnterior() {
    if (this.searchParam != '') {
      this.searchPage = this.searchLastPage
      this.searchLastPage--
      this.onPesquisar(this.searchParam, false)
    }else {
      this.allTitles(this.lastPage)
      this.page = this.lastPage
      this.lastPage--
    }
  }

  onPesquisar(searchParam: string, isSearch: boolean) {
    if (this.searchParam == '') {
      this.allTitles(this.page)
    } else {
      this.dataService.searchData(this.searchPage, searchParam, 'titulos').subscribe({
        next: data => {
          if (data.results.length == 0) {
            this.searchParam = ''
            this.allTitles(this.page)
            this.poNotification.error('Não foi encontrado nenhum titulo')
          } else {
            //resetar paginas caso filtre
            this.page = 1
            this.lastPage = 0
            this.hasNext = false

            this.titles = data

            //ajustar busca com paginacao
            this.searchNext = false;
            if (this.titles?.next) {
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
            this.poNotification.error('Ops!! Ocorreu um erro no mecanismo de busca do titulo.')
            this.searchPage = 1
            this.searchLastPage = 0
            this.searchNext = false
            this.allTitles(this.page)
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
    } else if (button == 'pass') {
      return true
    }
    return false
  }
}