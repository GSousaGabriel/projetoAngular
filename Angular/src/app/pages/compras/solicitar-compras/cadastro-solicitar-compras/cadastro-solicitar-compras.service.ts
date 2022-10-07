import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { PoLookupColumn, PoLookupFilter, PoLookupFilteredItemsParams, PoLookupResponseApi, PoTableColumn, PoSelectOption } from '@po-ui/ng-components';
import { AuthService } from 'src/app/components/shared/auth/auth.service';
import { environment } from 'src/environments/environment';

@Injectable()
export class CadastroSolicitarComprasService {

  getColumns(): Array<PoTableColumn> {
    return [
      { property: 'itens', label: ' ', type: 'cellTemplate', sortable: false, width: '100%' }
    ];
  }

  getColumnsLookup(type: string): Array<PoLookupColumn> {
    if (type == 'product') {
      return [
        { property: 'name', label: 'Produto' },
        { property: 'unit', label: 'Unidade' },
        { property: 'codErp', label: 'código ERP' }
      ]
    } else {
      return [
        { property: 'id', label: 'Cód Usuario' },
        { property: 'username', label: 'Usuário' },
        { property: 'first_name', label: 'Nome' },
        { property: 'last_name', label: 'Sobrenome' },
        { property: 'email', label: 'email' }
      ]
    }
  }

  optionsCurrency(): Array<PoSelectOption> {
    return [
      { value: 'BR', label: 'Real' },
      { value: 'US', label: 'Dolar' },
    ];
  }
}

@Injectable()
export class PostPurchaseOrders {
  api_link: string = environment.API_URL
  httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Token ' + this.authService.getToken() });

  constructor(private http: HttpClient,
    private authService: AuthService) { }

  postPurchaseOrders(purchaseOrders: any, itensOrder: any): Observable<any> {
    const body = {
      solicitacaoId: purchaseOrders.solicitacaoId,
      branch: purchaseOrders.branch,
      issueDate: purchaseOrders.issueDate,
      requester: purchaseOrders.requester,
      fluigNumber: purchaseOrders.fluigNumber,
      expenseTitle: purchaseOrders.expenseTitle,
      itens: itensOrder,
    };
    return this.http.post(this.api_link + 'solicitacaoCompra/', body,
      { headers: this.httpHeaders });
  }

  putPurchaseOrders(purchaseOrders: any, itensOrder: any): Observable<any> {
    const body = {
      branch: purchaseOrders.branch,
      issueDate: purchaseOrders.issueDate,
      itens: itensOrder,
    };
    return this.http.patch(this.api_link + 'solicitacaoCompra/' + purchaseOrders.solicitacaoId + '/', body,
      { headers: this.httpHeaders });
  }
}

@Injectable()
export class UpdateObservation {
  api_link: string = environment.API_URL
  httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Token ' + this.authService.getToken() });

  constructor(private http: HttpClient,
    private authService: AuthService) { }

  updateQuotationObservation(id: number, observation: string): Observable<any> {
    const body = {
      observation: observation,
    };
    return this.http.patch(this.api_link + 'itemCotacao/'+id+'/', body,
      { headers: this.httpHeaders });
  }
}

@Injectable()
export class OptionLookupFilter implements PoLookupFilter {
  api_link: string = environment.API_URL
  httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Token ' + this.authService.getToken() });

  constructor(private http: HttpClient,
    private authService: AuthService) { }

  getFilteredItems({ filter, page, filterParams }: PoLookupFilteredItemsParams): Observable<PoLookupResponseApi> {
    let numPage = ''

    if (page && filter) {
      filter = '?page=' + page + '&search=' + filter;
    } else if (page) {
      numPage = '?page=' + page;
    } else if (filter) {
      filter = '?search=' + filter;
    }

    return this.http.get(this.api_link + 'produto/' + numPage + filter, { headers: this.httpHeaders }).pipe(map((response: any) => ({
      items: response.results,
      hasNext: !!response.next
    })))
  }

  getObjectByValue(filterParams?: any): Observable<any> {
    return this.http.get(this.api_link + 'produto/' + filterParams + '/', { headers: this.httpHeaders }).pipe(map((response: any) => response));
  }
}