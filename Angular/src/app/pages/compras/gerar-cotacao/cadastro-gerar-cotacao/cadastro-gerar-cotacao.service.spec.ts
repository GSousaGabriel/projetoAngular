import { TestBed } from '@angular/core/testing';

import { CadastroGerarCotacaoService } from './cadastro-gerar-cotacao.service';

describe('CadastroGerarCotacaoService', () => {
  let service: CadastroGerarCotacaoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CadastroGerarCotacaoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
