import { Component, CUSTOM_ELEMENTS_SCHEMA, NgModule, OnInit, ViewChild } from '@angular/core';
import { FormsModule,ReactiveFormsModule }   from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ProdutosService } from './produtos.service';
import { DataManipulation } from 'src/app/components/shared/shared-services.service';
import { 
PoBreadcrumb, PoPageAction, PoTableColumn,
PoTableComponent, PoNotificationService, PoButtonGroupItem
} from '@po-ui/ng-components';

@NgModule({
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  imports: [
    BrowserModule,
    FormsModule , 
    ReactiveFormsModule
  ]
})
export class CustomModule {}

@Component({
  selector: 'app-produtos',
  templateUrl: './produtos.component.html',
  providers: [ProdutosService, DataManipulation],
  styleUrls: ['./produtos.component.css']
})

export class ProdutosComponent implements OnInit {
  @ViewChild(PoTableComponent, { static: true }) poTable!: PoTableComponent;

  searchPage: number= 1;
  searchLastPage: number= 0;
  searchNext: boolean= false;
  page: number= 1;
  lastPage: number= 0;
  hasNext: boolean= false;
  pagination: Array<PoButtonGroupItem> = [];
  searchParam: string = '';
  selectedProduct: Array<object> | any | [];
  products: Array<object> | any | [];
  productsColumns: Array<PoTableColumn> | any;

  public readonly actions: Array<PoPageAction> = [
    { label: 'Novo', action: this.onClickCadastrar.bind(this) ,icon:'po-icon-plus'},
    { label: 'Editar', icon: 'po-icon-pus', action: this.onClickEditar.bind(this) },
    { label: 'Excluir',  action: this.onClickExcluir.bind(this), icon: 'po-icon-minus' }
  ];

  public readonly breadcrumb: PoBreadcrumb = {
    items: [{ label: 'Produtos', link: '/produtos' }, { label: 'Listagem de Produtos' }]
  };
  
  constructor(
    private sampleAprovarProcessesService: ProdutosService,
    private dataService: DataManipulation,
    private router: Router,
    private poNotification: PoNotificationService
  ) {}

  ngOnInit() {
    this.allProducts(1);
    this.productsColumns = this.sampleAprovarProcessesService.getColumns();
  }

  buttonsPage(){
    return [
    { label: '', icon: 'po-icon-arrow-left', action: this.onAnterior.bind(this), disabled: this.disablePageButton('prev') },
    { label: '', icon: 'po-icon-arrow-right', action: this.onProximo.bind(this), disabled: this.disablePageButton('next') },   
    ];
  }

  allProducts(page:number) {
    this.dataService.getAllPageData(page, 'produto').subscribe({
      next: product=>{
        this.products = product;
        this.hasNext= false;

        if(this.products?.next){
          this.hasNext=true
        }
        this.pagination = this.buttonsPage();
      },
      error: error =>{
        if(error.status == 404){
          this.onAnterior();
        }else{
          this.poNotification.error('Ops!! Ocorreu um erro no cadastro do produto.') 
        }
      }
    })
  }

  onClickEditar(){
    var selectedItens = this.poTable.getSelectedRows()
    if (selectedItens.length > 0){
          this.dataService.getSingleData(selectedItens[0].id, 'produto').subscribe(product=>{
            this.router.navigateByUrl('/cadastro-produtos/'+selectedItens[0].id,{
            state:product
            });
          })
    }else{
      this.poNotification.error("Escolha um produto para edição")
    }
  }

  onClickExcluir(){
    var selectedItens = this.poTable.getSelectedRows()
    if (selectedItens.length > 0){
      this.dataService.deleteData(selectedItens[0].id, 'produto').subscribe({
        next: data => {  this.poNotification.success("Produto excluido com sucesso")
          if(this.searchParam != ''){
            this.onPesquisar(this.searchParam, false)
          }else{
            this.allProducts(this.page)}
          },
        error: error=> {  this.poNotification.error("Ocorreu um problema na exclusão")
          if(this.searchParam != ''){
            this.onPesquisar(this.searchParam, false)
          }else{
            this.allProducts(this.page)}
        }
      })
    }else{
      this.poNotification.error("Escolha um produto para exclusão")
    }
  }

  
onClickCadastrar() {
    this.router.navigate(['/cadastro-produtos/0']);
}

onProximo(){
  if(this.searchParam != ''){
    this.searchLastPage = this.searchPage
    this.searchPage++
    this.onPesquisar(this.searchParam, false)

  }else{
    this.allProducts(this.page+1)
    this.lastPage = this.page
    this.page++
  }
}

onAnterior(){
  if(this.searchParam != ''){
    this.searchPage = this.searchLastPage 
    this.searchLastPage--
    this.onPesquisar(this.searchParam, false)
  }else{
    this.allProducts(this.lastPage)
    this.page = this.lastPage
    this.lastPage--
  }
}

onPesquisar(searchParam: string, isSearch:boolean){
  if(this.searchParam == ''){
    this.allProducts(this.page)
  }else{
    this.dataService.searchData(this.searchPage, searchParam, 'produto').subscribe({
      next: data => {  
        if(data.results.length == 0){
          this.searchParam = ''
          this.allProducts(this.page)
          this.poNotification.error('Não foi encontrado nenhum produto')
        }else{
          //resetar paginas caso filtre
          this.page = 1
          this.lastPage = 0
          this.hasNext = false

          this.products = data

          //ajustar busca com paginacao
          this.searchNext= false;
          if(this.products?.next){
            this.searchNext=true
          }
          if(isSearch){
            this.poNotification.success('Busca concluida')
          }
          this.pagination = this.buttonsPage();
        }
      },
      error: error =>{
        if(error.status == 404){
          this.onAnterior();
        }else{
          this.poNotification.error('Ops!! Ocorreu um erro no mecanismo de busca do produto.')
          this.searchPage = 1
          this.searchLastPage = 0
          this.searchNext = false
          this.allProducts(this.page)}
      }
    })
  }
}

disablePageButton(button:string){
  let lastPage = this.lastPage
  let next = this.hasNext

  //modo com filtro
  if(this.searchParam != ''){
    lastPage = this.searchLastPage
    next = this.searchNext
  }

  if(button=='prev' && lastPage==0){
    return true
  }else if(button=='next' && !next){
    return true
  }
  return false
}
}
