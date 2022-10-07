import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroGerarCotacaoComponent } from './cadastro-gerar-cotacao.component';

describe('CadastroGerarCotacaoComponent', () => {
  let component: CadastroGerarCotacaoComponent;
  let fixture: ComponentFixture<CadastroGerarCotacaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CadastroGerarCotacaoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CadastroGerarCotacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
