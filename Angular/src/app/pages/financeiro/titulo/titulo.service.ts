import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PoTableColumn } from '@po-ui/ng-components';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/components/shared/auth/auth.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TituloService {

  constructor() { }
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
            label: 'Pendente aprovação',
            content: '',
          },
        ],
      },
      { property: 'supplier', label: 'Fornecedor', type: 'string' },
      { property: 'branch', label: 'Filial', type: 'string' },
      { property: 'fluigNumber', label: 'Número do fluig', type: 'number' },
      { property: 'prefix', label: 'Prefixo', type: 'string' },
      { property: 'titleNumber', label: 'Número do titulo', type: 'string' },
      { property: 'installment', label: 'Parcela' },
      { property: 'type', label: 'Tipo', type: 'string' },
      { property: 'dueDate', label: 'Vencimento', type: 'date' },
      { property: 'titleValue', label: 'Valor do titulo' },
    ];
  }
}