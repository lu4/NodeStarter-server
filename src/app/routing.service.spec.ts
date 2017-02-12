/* tslint:disable:no-unused-variable */

import 'jasmine';
import { RoutingService } from './routing.service';

describe('RoutesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RoutingService]
    });
  });

  it('should ...', inject([RoutingService], (service: RoutingService) => {
    expect(service).toBeTruthy();
  }));
});
