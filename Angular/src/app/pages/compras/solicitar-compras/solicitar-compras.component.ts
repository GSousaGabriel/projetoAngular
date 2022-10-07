import { Component, CUSTOM_ELEMENTS_SCHEMA, NgModule, OnInit, ViewChild } from '@angular/core';
import { FormsModule,ReactiveFormsModule }   from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { DataManipulation } from 'src/app/components/shared/shared-services.service';
import { SolicitarComprasService } from './solicitar-compras.service';

import { 
PoBreadcrumb, PoButtonGroupItem, PoNotificationService, PoPageAction, PoTableColumn, PoTableComponent
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
  selector: 'app-solicitar-compras',
  templateUrl: './solicitar-compras.component.html',
  providers: [SolicitarComprasService, DataManipulation],
  styleUrls: ['./solicitar-compras.component.css']
})
export class SolicitarComprasComponent implements OnInit {
  @ViewChild(PoTableComponent, { static: true }) poTable!: PoTableComponent;

  searchPage: number= 1;
  searchLastPage: number= 0;
  searchNext: boolean= false;
  page: number= 1;
  lastPage: number= 0;
  hasNext: boolean= false;
  pagination: Array<PoButtonGroupItem> = [];
  searchParam: string = '';
  purchaseOrders: Array<object> | any | [];
  aprovarProcessesColumns: Array<PoTableColumn> | any;
  
  public readonly actions: Array<PoPageAction> = [
    { label: 'Cadastrar', action: this.registerPurchaseOrder.bind(this), icon:'po-icon-plus'},
    { label: 'Editar', action: this.editPurchaseOrder.bind(this)},
    { label: 'Excluir', action: this.deletePurchaseOrder.bind(this)},
  ];

  public readonly breadcrumb: PoBreadcrumb = {
    items: [{ label: 'Solicitações de compra', link:'/solicitar-compras' }, { label: 'Solicitações de compra' }]
  };

  constructor(
    private sampleAprovarProcessesService: SolicitarComprasService,
    private dataService: DataManipulation,
    private router: Router,
    private poNotification: PoNotificationService
  ) {}

  ngOnInit() {
    this.allPurchaseOrders(1);
    this.aprovarProcessesColumns = this.sampleAprovarProcessesService.getColumns();
  }

  buttonsPage(){
    return [
    { label: '', icon: 'po-icon-arrow-left', action: this.onAnterior.bind(this), disabled: this.disablePageButton('prev') },
    { label: '', icon: 'po-icon-arrow-right', action: this.onProximo.bind(this), disabled: this.disablePageButton('next') },   
    ];
  }

  allPurchaseOrders(page: number) {
    this.dataService.getAllPageData(page,'solicitacaoCompraView').subscribe({
      next: purchaseOrder=>{
        this.purchaseOrders = purchaseOrder;
        this.hasNext= false;
        if(this.purchaseOrders?.next){
          this.hasNext=true
        }
        this.pagination = this.buttonsPage();
      },
      error: error =>{
        if(error.status == 404){
          this.onAnterior();
        }else{
          this.poNotification.error('Ops!! Ocorreu um erro no cadastro da solictação de compra.') 
        }
      }
    })
  }

  editPurchaseOrder(){
    var selectedItens = this.poTable.getSelectedRows()
    if (selectedItens.length > 0){
      this.dataService.getSingleData(selectedItens[0].solicitacaoId, 'solicitacaoCompraView').subscribe(purchaseOrder=>{
        this.router.navigateByUrl('/cadastro-solicitar-compras/'+selectedItens[0].solicitacaoId,{
        state:purchaseOrder
        });
      })
    }else{
      this.poNotification.error("Escolha uma solictação de compra para edição")
    }
  }

  deletePurchaseOrder() {
    var selectedItens = this.poTable.getSelectedRows()
    if (selectedItens.length > 0){
          this.dataService.deleteData(selectedItens[0].solicitacaoId, 'solicitacaoCompra').subscribe({
              next: data => { 
                
                //Delete itens
                for(var i=0; selectedItens[0].itens.length > i;i++){
                  this.dataService.deleteData(selectedItens[0].itens[i].id, 'itensSolicitacao').subscribe(data => {
                    console.log(data)
                  })
                }
                      
                if(this.searchParam != ''){
                  this.onPesquisar(this.searchParam, false)
                }else{
                  this.allPurchaseOrders(this.page)
                }
                this.poNotification.success("Solictação de compra excluida com sucesso")
            },
            error: error=> { 
              let msg= "Ocorreu um problema na exclusão"
              
              if(error.status==500){
                msg= "Por favor, exclua primeiro a cotação"
              }

              this.poNotification.error(msg)
              
              if(this.searchParam != ''){
                this.onPesquisar(this.searchParam, false)
              }else{
                this.allPurchaseOrders(this.page)
              }          
            }
          })
    }else{
      this.poNotification.error("Escolha uma solictação de compra para exclusão")
    }
  }

  private registerPurchaseOrder() {
    this.router.navigate(['/cadastro-solicitar-compras/0']);
  }

  onProximo(){
    if(this.searchParam != ''){
      this.searchLastPage = this.searchPage
      this.searchPage++
      this.onPesquisar(this.searchParam, false)
  
    }else{
      this.allPurchaseOrders(this.page+1)
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
      this.allPurchaseOrders(this.lastPage)
      this.page = this.lastPage
      this.lastPage--
    }
  }
  
  onPesquisar(searchParam: string, isSearch:boolean){
    if(this.searchParam == ''){
      this.allPurchaseOrders(this.page)
    }else{
      this.dataService.searchData(this.searchPage, searchParam, 'solicitacaoCompraView').subscribe({
        next: data => {  
          if(data.results.length == 0){
            this.searchParam = ''
            this.allPurchaseOrders(this.page)
            this.poNotification.error('Não foi encontrado nenhuma solictação de compra')
          }else{
            //resetar paginas caso filtre
            this.page = 1
            this.lastPage = 0
            this.hasNext = false
    
            this.purchaseOrders = data
    
            //ajustar busca com paginacao
            this.searchNext= false;
            if(this.purchaseOrders?.next){
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
            this.poNotification.error('Ops!! Ocorreu um erro no mecanismo de busca da solictação de compra.')
            this.searchPage = 1
            this.searchLastPage = 0
            this.searchNext = false
            this.allPurchaseOrders(this.page)
          }
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
