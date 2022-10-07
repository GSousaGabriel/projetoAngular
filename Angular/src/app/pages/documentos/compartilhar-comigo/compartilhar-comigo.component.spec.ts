import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompartilharComigoComponent } from './compartilhar-comigo.component';

describe('CompartilharComigoComponent', () => {
  let component: CompartilharComigoComponent;
  let fixture: ComponentFixture<CompartilharComigoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompartilharComigoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompartilharComigoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
