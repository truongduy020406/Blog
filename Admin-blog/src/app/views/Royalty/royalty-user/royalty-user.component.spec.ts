import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoyaltyUserComponent } from './royalty-user.component';

describe('RoyaltyUserComponent', () => {
  let component: RoyaltyUserComponent;
  let fixture: ComponentFixture<RoyaltyUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoyaltyUserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoyaltyUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
