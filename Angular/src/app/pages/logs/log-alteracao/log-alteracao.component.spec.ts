import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogAlteracaoComponent } from './log-alteracao.component';

describe('LogAlteracaoComponent', () => {
  let component: LogAlteracaoComponent;
  let fixture: ComponentFixture<LogAlteracaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LogAlteracaoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LogAlteracaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
