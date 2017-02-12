/* tslint:disable:no-unused-variable */

import 'jasmine';
import { ExpressService } from './express.service';

describe('ExpressService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ExpressService]
    });
  });

  it('should ...', inject([ExpressService], (service: ExpressService) => {
    expect(service).toBeTruthy();
  }));
});
