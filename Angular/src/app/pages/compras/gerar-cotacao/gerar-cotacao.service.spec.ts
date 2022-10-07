import { TestBed } from '@angular/core/testing';

import { GerarCotacaoService } from './gerar-cotacao.service';

describe('GerarCotacaoService', () => {
  let service: GerarCotacaoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GerarCotacaoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
