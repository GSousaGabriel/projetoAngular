import { Injectable } from '@angular/core';
import { PoTableColumn } from '@po-ui/ng-components';

@Injectable()
export class SolicitarComprasService {
  getColumns(): Array<PoTableColumn> {
    return [
      { property: 'solicitacaoId', label: 'Código', type: 'string' },
      { property: 'branch', label: 'Filial', type: 'string' },
      { property: 'fluigNumber', label: 'Número do fluig', type: 'string' },
      { property: 'expenseTitle', label: 'Titulo do expense', type: 'string' },
      { property: 'requester.username', label: 'Solicitante', type: 'string' },
      { property: 'issueDate', label: 'data de Emissão', type: 'date' },
    ];
  }
}