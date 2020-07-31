import { TestBed } from '@angular/core/testing';

import { ServerConncService } from './server-connc.service';

describe('ServerConncService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ServerConncService = TestBed.get(ServerConncService);
    expect(service).toBeTruthy();
  });
});
