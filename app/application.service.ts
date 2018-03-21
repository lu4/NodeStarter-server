import { ConfigurationService } from './configuration.service';
import { Injectable } from 'injection-js';
import { ExpressService } from './express.service';
import { ExpressRouterService } from './express-router.service';

import * as Jwt from './jwt.service';
import * as winston from 'winston';

@Injectable()
export class ApplicationService {
    constructor(
        private expressService: ExpressService,
        private configurationService: ConfigurationService
    ) {
    }

    public start() {
        (<any>winston).level = 'silly';

        winston.log('info', 'Application        | Launching...');

        this.expressService.launch();

        if (this.configurationService.environment.type === 'development') {
            return Promise.resolve();
        } else {
            return Promise.resolve();
        }
    }
}
