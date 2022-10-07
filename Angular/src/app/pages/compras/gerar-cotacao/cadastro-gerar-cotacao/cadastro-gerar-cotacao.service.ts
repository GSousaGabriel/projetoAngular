import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PoLookupFilter, PoLookupFilteredItemsParams, PoLookupResponseApi, PoTableColumn, PoLookupColumn } from '@po-ui/ng-components';
import { AuthService } from 'src/app/components/shared/auth/auth.service';
import { environment } from 'src/environments/environment';

@Injectable()
export class CadastroGerarCotacaoService {
  getColumns(): Array<PoTableColumn> {
    return [
      { property: 'id', label: 'Id', type: 'cellTemplate', visible: false },
      { property: 'productCode', label: ' ', type: 'cellTemplate', sortable: false },
    ];
  }

  getColumnsLookup(type: string): Array<PoLookupColumn> {
    switch (type) {
      case 'supplier':
        return [
          { property: 'id', label: 'Id' },
          { property: 'socialName', label: 'Razão Social' },
          { property: 'document', label: 'CNPJ' }
        ]
      case 'product':
        return [
          { property: 'productCode', label: 'Cód. Produto' },
          { property: 'product', label: 'Produto' },
          { property: 'unit', label: 'Un. medida' },
          { property: 'quantity', label: 'Quantidade' },
          { property: 'currency', label: 'Moeda' },
          { property: 'necessityDate', label: 'Data de necessidade' },
        ]
      case 'order':
        return [
          { property: 'solicitacaoId', label: 'Código solicitação' },
          { property: 'branch', label: 'Filial' },
          { property: 'issueDate', label: 'Data de emissão', type: 'date' },
          { property: 'requester.username', label: 'Solicitante' }
        ]
    }
    return []
  }
}

@Injectable()
export class PostQuotation {
  api_link: string = environment.API_URL
  httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Token ' + this.authService.getToken() });

  constructor(private http: HttpClient,
    private authService: AuthService) { }

  postQuotations(quotations: any, itensQuotation: any): Observable<any> {
    const body = {
      solicitacaoCotacao: quotations.solicitacaoCotacao,
      fluigNumber: quotations.fluigNumber,
      expenseTitle: quotations.expenseTitle,
      issueDate: quotations.issueDate,
      buyer: quotations.buyer,
      itens: itensQuotation,
    };
    return this.http.post(this.api_link + 'cotacaoCompra/', body,
      { headers: this.httpHeaders });
  }

  putQuotations(quotations: any, itensQuotation: any): Observable<any> {
    const body = {
      solicitacaoCotacao: quotations.solicitacaoCotacao,
      issueDate: quotations.issueDate,
      itens: itensQuotation,
    };
    return this.http.patch(`${this.api_link}cotacaoCompra/${quotations.cotacaoId}/`, body,
      { headers: this.httpHeaders });
  }

  updateItem(id: number, data: any): Observable<any> {
    return this.http.put(`${this.api_link}cotacaoCompra/${id}/`, data, { headers: this.httpHeaders });
  }

  updatePurchaseOrder(id: number): Observable<any> {
    const patchedData = {
      alreadyListed: 2
    }
    return this.http.patch(`${this.api_link}solicitacaoCompra/${id}/`, patchedData, { headers: this.httpHeaders });
  }
}

@Injectable()
export class LookupFilterOptionOrder implements PoLookupFilter {
  api_link: string = environment.API_URL
  httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Token ' + this.authService.getToken() });

  constructor(private http: HttpClient,
    private authService: AuthService) { }

  getFilteredItems({ filter, page, filterParams }: PoLookupFilteredItemsParams): Observable<PoLookupResponseApi> {
    let numPage = ''

    if (page) {
      numPage = '&page=' + page;
    } else if (filter) {
      filter = '&search=' + filter;
    }

    return this.http.get(`${this.api_link}solicitacaoCompraView/?filter=1${numPage}${filter}`, { headers: this.httpHeaders }).pipe(map((response: any) => ({
      items: response.results,
      hasNext: !!response.next
    })))
  }

  getObjectByValue(value: any, filterParams?: any): Observable<any> {
    if (typeof value != 'number') {
      value = value.id
    }
    return this.http.get(`${this.api_link}solicitacaoCompraView/${value}/`, { headers: this.httpHeaders }).pipe(map((response: any) => response));
  }
}

@Injectable()
export class LookupFilterOptionProduct implements PoLookupFilter {
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
    }

    return this.http.get(this.api_link + 'solicitacaoCompraView/' + filterParams, { headers: this.httpHeaders }).pipe(map((response: any) => ({
      items: response.itens,
      hasNext: !!response.next
    })))
  }

  getObjectByValue(value: string | any[], filterParams?: any): Observable<any> {
    return this.http.get(`${this.api_link}itensSolicitacao/${value}/`, { headers: this.httpHeaders }).pipe(map((response: any) =>
      response));
  }
}