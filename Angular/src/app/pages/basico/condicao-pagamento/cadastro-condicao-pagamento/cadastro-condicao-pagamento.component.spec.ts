import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroCondicaoPagamentoComponent } from './cadastro-condicao-pagamento.component';

describe('CadastroCondicaoPagamentoComponent', () => {
  let component: CadastroCondicaoPagamentoComponent;
  let fixture: ComponentFixture<CadastroCondicaoPagamentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CadastroCondicaoPagamentoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CadastroCondicaoPagamentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
