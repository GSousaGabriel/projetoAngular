import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalisaCotacaoComponent } from './analisa-cotacao.component';

describe('AnalisaCotacaoComponent', () => {
  let component: AnalisaCotacaoComponent;
  let fixture: ComponentFixture<AnalisaCotacaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnalisaCotacaoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalisaCotacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
