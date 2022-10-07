import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GerarCotacaoComponent } from './gerar-cotacao.component';

describe('GerarCotacaoComponent', () => {
  let component: GerarCotacaoComponent;
  let fixture: ComponentFixture<GerarCotacaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GerarCotacaoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GerarCotacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
