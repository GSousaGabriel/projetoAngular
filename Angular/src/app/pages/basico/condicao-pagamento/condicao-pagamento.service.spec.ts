import { TestBed } from '@angular/core/testing';

import { CondicaoPagamentoService } from './condicao-pagamento.service';

describe('CondicaoPagamentoService', () => {
  let service: CondicaoPagamentoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CondicaoPagamentoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
