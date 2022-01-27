import { TestBed } from '@angular/core/testing';

import { DataPipelineService } from './data-pipeline.service';

describe('DataPipelineService', () => {
  let service: DataPipelineService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataPipelineService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
