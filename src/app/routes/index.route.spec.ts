/* tslint:disable:no-unused-variable */

import 'jasmine';
import { IndexRoute } from './index.route';

describe('IndexService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IndexRoute]
    });
  });

  it('should ...', inject([IndexRoute], (service: IndexRoute) => {
    expect(service).toBeTruthy();
  }));
});
