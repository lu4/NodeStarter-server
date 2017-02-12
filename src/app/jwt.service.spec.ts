/* tslint:disable:no-unused-variable */

import 'jasmine';
import { JwtService } from './jwt.service';

describe('JwtService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [JwtService]
    });
  });

  it('should ...', inject([JwtService], (service: JwtService) => {
    expect(service).toBeTruthy();
  }));
});
