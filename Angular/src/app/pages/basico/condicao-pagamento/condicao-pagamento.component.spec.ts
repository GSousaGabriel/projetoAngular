import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CondicaoPagamentoComponent } from './condicao-pagamento.component';

describe('CondicaoPagamentoComponent', () => {
  let component: CondicaoPagamentoComponent;
  let fixture: ComponentFixture<CondicaoPagamentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CondicaoPagamentoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CondicaoPagamentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
