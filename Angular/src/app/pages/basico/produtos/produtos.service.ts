import { Injectable } from '@angular/core';
import { PoTableColumn } from '@po-ui/ng-components';

@Injectable()
export class ProdutosService {
  getColumns(): Array<PoTableColumn> {
    return [
      { property: 'id', label: 'Código', type: 'string' },
      { property: 'name', label: 'Nome do produto', type: 'string' },
      { property: 'description', label: 'Descrição do produto', type: 'string' },
    ];
  }
}