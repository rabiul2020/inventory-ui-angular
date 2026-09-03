import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RolepermissionComponent } from './rolepermission.component';

describe('RolepermissionComponent', () => {
  let component: RolepermissionComponent;
  let fixture: ComponentFixture<RolepermissionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RolepermissionComponent]
    });
    fixture = TestBed.createComponent(RolepermissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
