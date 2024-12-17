import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostSeriesComponent } from './post-series.component';

describe('PostSeriesComponent', () => {
  let component: PostSeriesComponent;
  let fixture: ComponentFixture<PostSeriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostSeriesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostSeriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
