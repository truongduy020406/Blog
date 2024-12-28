import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoyaltyMonthComponent } from './royalty-month.component';

describe('RoyaltyMonthComponent', () => {
  let component: RoyaltyMonthComponent;
  let fixture: ComponentFixture<RoyaltyMonthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoyaltyMonthComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoyaltyMonthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
