import { TestBed } from '@angular/core/testing';

import { AnalisaCotacaoService } from './analisa-cotacao.service';

describe('AnalisaCotacaoService', () => {
  let service: AnalisaCotacaoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AnalisaCotacaoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
