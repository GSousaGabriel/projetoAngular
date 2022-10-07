import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeusDocumentosComponent } from './meus-documentos.component';

describe('MeusDocumentosComponent', () => {
  let component: MeusDocumentosComponent;
  let fixture: ComponentFixture<MeusDocumentosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MeusDocumentosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MeusDocumentosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
