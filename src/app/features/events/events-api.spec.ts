import { TestBed } from '@angular/core/testing';

import { EventsApi } from './events-api';

describe('EventsApi', () => {
  let service: EventsApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventsApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
