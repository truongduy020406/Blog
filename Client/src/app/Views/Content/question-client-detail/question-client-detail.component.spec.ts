import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionClientDetailComponent } from './question-client-detail.component';

describe('QuestionClientDetailComponent', () => {
  let component: QuestionClientDetailComponent;
  let fixture: ComponentFixture<QuestionClientDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuestionClientDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuestionClientDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
