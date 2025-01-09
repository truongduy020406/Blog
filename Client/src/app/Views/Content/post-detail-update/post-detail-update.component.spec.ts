import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostDetailUpdateComponent } from './post-detail-update.component';

describe('PostDetailUpdateComponent', () => {
  let component: PostDetailUpdateComponent;
  let fixture: ComponentFixture<PostDetailUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostDetailUpdateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostDetailUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
