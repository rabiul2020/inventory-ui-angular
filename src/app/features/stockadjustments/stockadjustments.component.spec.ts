import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockadjustmentsComponent } from './stockadjustments.component';

describe('StockadjustmentsComponent', () => {
  let component: StockadjustmentsComponent;
  let fixture: ComponentFixture<StockadjustmentsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StockadjustmentsComponent]
    });
    fixture = TestBed.createComponent(StockadjustmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
