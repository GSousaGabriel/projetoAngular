import { TestBed } from '@angular/core/testing';

import { CadastroCondicaoPagamentoService } from './cadastro-condicao-pagamento.service';

describe('CondicaoPagamentoService', () => {
  let service: CadastroCondicaoPagamentoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CadastroCondicaoPagamentoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
