import { TestBed } from '@angular/core/testing';

import { SolicitarComprasService } from './solicitar-compras.service';

describe('SolicitarComprasService', () => {
  let service: SolicitarComprasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SolicitarComprasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
