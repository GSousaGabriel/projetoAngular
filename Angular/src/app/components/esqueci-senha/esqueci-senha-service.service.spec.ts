import { TestBed } from '@angular/core/testing';

import { EsqueciSenhaServiceService } from './esqueci-senha-service.service';

describe('EsqueciSenhaServiceService', () => {
  let service: EsqueciSenhaServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EsqueciSenhaServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
