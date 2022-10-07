import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroSolicitarComprasComponent } from './cadastro-solicitar-compras.component';

describe('CadastroSolicitarComprasComponent', () => {
  let component: CadastroSolicitarComprasComponent;
  let fixture: ComponentFixture<CadastroSolicitarComprasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CadastroSolicitarComprasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CadastroSolicitarComprasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
