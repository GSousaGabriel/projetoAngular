import { TestBed } from '@angular/core/testing';

import { CadastroSolicitarComprasService } from './cadastro-solicitar-compras.service';

describe('CadastroSolicitarComprasService', () => {
  let service: CadastroSolicitarComprasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CadastroSolicitarComprasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
