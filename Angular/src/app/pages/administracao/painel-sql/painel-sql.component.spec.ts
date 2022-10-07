import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PainelSQLComponent } from './painel-sql.component';

describe('PainelSQLComponent', () => {
  let component: PainelSQLComponent;
  let fixture: ComponentFixture<PainelSQLComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PainelSQLComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PainelSQLComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
