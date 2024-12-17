import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostActivityLogsComponent } from './post-activity-logs.component';

describe('PostActivityLogsComponent', () => {
  let component: PostActivityLogsComponent;
  let fixture: ComponentFixture<PostActivityLogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostActivityLogsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostActivityLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
