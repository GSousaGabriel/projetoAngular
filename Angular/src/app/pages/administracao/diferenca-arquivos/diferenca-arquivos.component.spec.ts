import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiferencaArquivosComponent } from './diferenca-arquivos.component';

describe('DiferencaArquivosComponent', () => {
  let component: DiferencaArquivosComponent;
  let fixture: ComponentFixture<DiferencaArquivosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DiferencaArquivosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DiferencaArquivosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
