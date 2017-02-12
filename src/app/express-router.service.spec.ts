/* tslint:disable:no-unused-variable */

import 'jasmine';
import { ExpressRouterService } from './express-router.service';

describe('ExpressRouterService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ExpressRouterService]
    });
  });

  it('should ...', inject([ExpressRouterService], (service: ExpressRouterService) => {
    expect(service).toBeTruthy();
  }));
});
