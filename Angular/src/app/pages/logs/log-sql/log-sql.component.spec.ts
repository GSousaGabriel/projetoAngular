import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogSQLComponent } from './log-sql.component';

describe('LogSQLComponent', () => {
  let component: LogSQLComponent;
  let fixture: ComponentFixture<LogSQLComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LogSQLComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LogSQLComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
