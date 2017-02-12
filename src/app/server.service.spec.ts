/* tslint:disable:no-unused-variable */

import 'jasmine';
import { ServerService } from './server.service';

describe('ServerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ServerService]
    });
  });

  it('should ...', inject([ServerService], (service: ServerService) => {
    expect(service).toBeTruthy();
  }));
});
