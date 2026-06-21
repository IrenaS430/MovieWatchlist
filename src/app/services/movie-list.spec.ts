import { TestBed } from '@angular/core/testing';

import { MovieList } from './movie-list';

describe('MovieList', () => {
  let service: MovieList;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MovieList);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
