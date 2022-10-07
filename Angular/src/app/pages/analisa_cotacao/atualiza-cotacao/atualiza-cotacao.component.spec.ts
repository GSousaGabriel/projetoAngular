import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AtualizaCotacaoComponent } from './atualiza-cotacao.component';

describe('AtualizaCotacaoComponent', () => {
  let component: AtualizaCotacaoComponent;
  let fixture: ComponentFixture<AtualizaCotacaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AtualizaCotacaoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AtualizaCotacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
