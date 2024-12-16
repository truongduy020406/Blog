import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleAssignComponent } from './role-assign.component';

describe('RoleAssignComponent', () => {
  let component: RoleAssignComponent;
  let fixture: ComponentFixture<RoleAssignComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoleAssignComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoleAssignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
