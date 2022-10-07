import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnviarDocumentosComponent } from './enviar-documentos.component';

describe('EnviarDocumentosComponent', () => {
  let component: EnviarDocumentosComponent;
  let fixture: ComponentFixture<EnviarDocumentosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnviarDocumentosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EnviarDocumentosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
