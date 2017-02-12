/* tslint:disable:no-unused-variable */

import 'jasmine';
import { SocketServerService } from './socket-server.service';

describe('SocketServerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SocketServerService]
    });
  });

  it('should ...', inject([SocketServerService], (service: SocketServerService) => {
    expect(service).toBeTruthy();
  }));
});
