import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitarComprasComponent } from './solicitar-compras.component';

describe('SolicitarComprasComponent', () => {
  let component: SolicitarComprasComponent;
  let fixture: ComponentFixture<SolicitarComprasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SolicitarComprasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SolicitarComprasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
