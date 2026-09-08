import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesreturnComponent } from './salesreturn.component';

describe('SalesreturnComponent', () => {
  let component: SalesreturnComponent;
  let fixture: ComponentFixture<SalesreturnComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SalesreturnComponent]
    });
    fixture = TestBed.createComponent(SalesreturnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
