import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { PoTableColumn } from '@po-ui/ng-components';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/components/shared/auth/auth.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AnalisaCotacaoService {

  constructor(private router: Router) { }

  getColumns(): Array<PoTableColumn> {
    return [
      { property: 'solicitacaoId', label: 'Solicitação Id', type: 'string' },
      { property: 'issueDate', label: 'Data de Emissão', type: 'date' },
      { property: 'requester.username', label: 'Comprador', type: 'string' },
    ];
  }

  getColumnsItens(): Array<PoTableColumn> {
    return [
      {
        property: 'approve', label: 'Status', type: 'label', sortable: false, width: '100px', labels: [
          { value: 1, color: 'color-10', label: 'Aprovado' },
          { value: 2, color: 'color-07', label: 'Reprovado' },
          { value: 3, color: 'color-08', label: 'Cotando' },
          { value: 4, color: 'color-04', label: 'Cotado' },
        ]
      },
      { property: 'quotationId', label: 'Cotação', type: 'string', width: '75px', sortable: false },
      {
        property: 'bestValue', label: 'Vencedor', type: 'subtitle', width: '100px', sortable: false, subtitles: [
          {
            value: 1,
            color: 'color-10',
            label: 'Melhor Valor',
            content: ''
          },
          {
            value: 2,
            color: 'color-07',
            label: 'Piores Valores',
            content: '',
          }
        ],
      },
      {
        property: 'hasAttachment',
        label: 'Anexo',
        type: 'link',
        action: (value: any, row: any) => {
          window.open(row.attachment, "_blank");
        }
      },
      { property: 'id', label: 'ID', type: 'string', visible: false, sortable: false },
      { property: 'productCode', label: 'Código do Produto', type: 'string', sortable: false },
      { property: 'product', label: 'Produto', type: 'string', sortable: false },
      { property: 'supplierId.socialName', label: 'Fornecedor', type: 'string', sortable: false },
      { property: 'paymentTermsId.description', label: 'Cond. Pagamento', type: 'string', sortable: false },
      { property: 'unit', label: 'Un. medida', type: 'string', sortable: false },
      { property: 'valueIPI', label: 'IPI(%)', type: 'string', sortable: false },
      { property: 'valueICMS', label: 'ICMS(%)', type: 'string', sortable: false },
      { property: 'quantity', label: 'Qtd Solic', type: 'string', sortable: false },
      { property: 'quotationQuantity', label: 'Qtd. Cot', type: 'string', sortable: false },
      { property: 'unitValue', label: 'Valor Unit.', type: 'string', sortable: false },
      { property: 'totalQuotation', label: 'Valor total', type: 'string', sortable: false },
      { property: 'necessityDate', label: 'Data de necessidade', type: 'date', sortable: false },
      { property: 'validDate', label: 'Data de validade', type: 'date', sortable: false },
      { property: 'deadline', label: 'Dias para entrega', type: 'string', sortable: false },
      { property: 'observationSupplier', label: 'Obs. do Fornecedor', type: 'string', sortable: false },
      { property: 'approveReason', label: 'Motivo Aprovação', type: 'string', sortable: false }
    ];
  }
  teste(){
    alert('dasa')
    return 'dsa'
  }
}

@Injectable()
export class ApproveItemQuotation {
  api_link: string = environment.API_URL
  httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Token ' + this.authService.getToken() });

  constructor(private http: HttpClient,
    private authService: AuthService) { }

  approveItem(id: number, data: any, sendEmail: boolean): Observable<any> {
    var queryParam= ''
    
    if(sendEmail){
      queryParam= '?sendEmail=1'
    }

    const approve = {
      itens:data,
      approve: data.approve,
      approveReason: data.approveReason
    }
    return this.http.patch(`${this.api_link}itemCotacao/${id}/${queryParam}`, approve,
      { headers: this.httpHeaders });
  }

  approveQuotation(id: number, status: any): Observable<any> {
    const approve = {
      status: status
    }
    return this.http.patch(`${this.api_link}cotacaoCompra/${id}/`, approve,
      { headers: this.httpHeaders });
  }
}

@Injectable()
export class HttpRequestQuotation {
  api_link: string = environment.API_URL
  httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Token ' + this.authService.getToken() });

  constructor(private http: HttpClient,
    private authService: AuthService) { }

  getAllFilteredPageData(numPage: number): Observable<any> {
    return this.http.get(`${this.api_link}solicitacaoCompraView/?page=${numPage}&empty=no`, { headers: this.httpHeaders });
  }
}