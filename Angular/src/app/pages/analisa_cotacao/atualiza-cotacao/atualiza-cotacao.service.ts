import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PoTableColumn } from '@po-ui/ng-components';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/components/shared/auth/auth.service';
import { environment } from 'src/environments/environment';
import { IitensCotacao } from '../../interfaces/atualiza-cotacao-json';

@Injectable({
  providedIn: 'root'
})
export class AtualizaCotacaoService {

  constructor() { }

  getColumns(): Array<PoTableColumn> {
    return [
      { property: 'cotacaoId', label: 'Código da cotação', type: 'string' },
      { property: 'issueDate', label: 'Data de Emissão', type: 'date' },
      { property: 'buyer', label: 'Comprador', type: 'string' },
      { property: 'shipping', label: 'Tipo do frete', type: 'string' },
      { property: 'shippingValue', label: 'Valor do frete', type: 'string' }
    ];
  }

  getColumnsItens(staff: boolean): Array<PoTableColumn> {
    return [
      { property: 'id', label: 'ID', type: 'cellTemplate', visible: false },
      { property: 'product', label: 'Produto', type: 'cellTemplate', width: '200px' },
      { property: 'supplierId', label: 'Fornecedor', type: 'cellTemplate', width: '200px', visible: staff },
      { property: 'observation', label: 'Obs. Empresa', type: 'cellTemplate', width: '200px' },
      { property: 'observationSupplier', label: 'Obs. Fornecedor', type: 'cellTemplate', width: '200px' },
      { property: 'paymentTermsId', label: 'Condição de pagamento', type: 'cellTemplate' },
      { property: 'unit', label: 'Un. Medida', type: 'cellTemplate' },
      { property: 'quantity', label: 'Qtd. Solicitada', type: 'cellTemplate' },
      { property: 'quotationQuantity', label: 'Qtd. Cotada', type: 'cellTemplate' },
      { property: 'necessityDate', label: 'Data de necessidade', type: 'cellTemplate' },
      { property: 'validDate', label: 'Data de validade', type: 'cellTemplate', width: '140px' },
      { property: 'deadline', label: 'Prazo de entrega', type: 'cellTemplate' },
      { property: 'unitValue', label: 'Valor unitário', type: 'cellTemplate' },
      { property: 'valueIPI', label: 'IPI(%)', type: 'cellTemplate', width: '80px' },
      { property: 'valueICMS', label: 'ICMS(%)', type: 'cellTemplate' },
      { property: 'totalQuotation', label: 'Valor total', type: 'cellTemplate' }
    ];
  }
}

@Injectable()
export class HttpQuotation {
  //httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Token ' + this.authService.getToken() });
  httpHeaders = new HttpHeaders({'Authorization': 'Token ' + this.authService.getToken() });
  api_link: string = environment.API_URL
 

  constructor(private http: HttpClient,
    private authService: AuthService) { }

  updateItem(id: number, data: IitensCotacao): Observable<any> {
    const form = new FormData();
    
    form.append("approve", data.approve)
    form.append("paymentTermsId",data.paymentTermsId)
    form.append("quotationQuantity",data.quotationQuantity)
    form.append("validDate",data.validDate)
    form.append("necessityDate",data.necessityDate)
    form.append("valueICMS",data.valueICMS)
    form.append("valueIPI",data.valueIPI)
    form.append("unitValue",  data.unitValue)
    form.append("totalQuotation",  data.totalQuotation)
    form.append("observationSupplier",data.observationSupplier)
    form.append("bestValue",data.bestValue)
    form.append("shipping",  data.shipping)
    form.append("shippingValue",  data.shippingValue)

    if (typeof data.attachment != 'undefined'){
      form.append("attachment", data.attachment.file, data.attachment.file.name);
    }

    return this.http.patch(`${this.api_link}itemCotacao/${id}/?useId=1`, form, { headers: this.httpHeaders });
  }

  sendEmailSupplier(id: number, idSupplier: number): Observable<any> {
    return this.http.get(`${this.api_link}cotacaoCompraView/${id}/?sendEmail=2&idSupplier=${idSupplier}`, { headers: this.httpHeaders });
  }

  calculatePrice(id: number, row: any): Observable<any> {
    return this.http.put(`${this.api_link}cotacaoCompra/${id}/?listed=1`, row, { headers: this.httpHeaders });
  }

  filteredData(id: number, page: number, userType: string): Observable<any> {
    let param = '1'
    if (userType != 'supplier') {
      param = '2'
    }
    return this.http.get(`${this.api_link}cotacaoCompra/?filter=${param}&user=${id}&page=${page}`, { headers: this.httpHeaders });
  }
}