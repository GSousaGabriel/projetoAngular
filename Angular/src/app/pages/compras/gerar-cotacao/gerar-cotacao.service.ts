import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PoTableColumn } from '@po-ui/ng-components';
import { map, Observable } from 'rxjs';
import { AuthService } from 'src/app/components/shared/auth/auth.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GerarCotacaoService {
  getColumns(): Array<PoTableColumn> {
    return [
      {
        property: 'status',
        label: 'Status',
        type: 'subtitle',
        subtitles: [
          {
            value: 1,
            color: 'success',
            label: 'Aprovado',
            content: '',
          },
          {
            value: 2,
            color: 'danger',
            label: 'Reprovado',
            content: '',
          },
          {
            value: 3,
            color: 'warning',
            label: 'Aguardando',
            content: '',
          },
        ],
      },
      { property: 'cotacaoId', label: 'cotação Id', type: 'string' },
      { property: 'fluigNumber', label: 'Número do fluig', type: 'string' },
      { property: 'expenseTitle', label: 'Titulo do expense', type: 'string' },
      { property: 'issueDate', label: 'Data de Emissão', type: 'date' },
      { property: 'buyer', label: 'Comprador', type: 'string' },
    ];
  }
}

@Injectable()
export class PatchSolicitacao {
  api_link: string = environment.API_URL
  httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Token ' + this.authService.getToken() });

  constructor(private http: HttpClient,
    private authService: AuthService) { }

  patchSolicitacao(id: string): Observable<any> {
    const body = { alreadyListed: 1 };
    return this.http.patch(this.api_link + 'solicitacaoCompra/' + id + '/', body,
      { headers: this.httpHeaders });
  }
}