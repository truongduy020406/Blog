import { TestBed } from '@angular/core/testing';

import { PostCategoryService } from './post-category.service';

describe('PostCategoryService', () => {
  let service: PostCategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PostCategoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
