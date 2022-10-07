import { TestBed } from '@angular/core/testing';

import { AtualizaCotacaoService } from './atualiza-cotacao.service';

describe('AtualizaCotacaoService', () => {
  let service: AtualizaCotacaoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AtualizaCotacaoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
