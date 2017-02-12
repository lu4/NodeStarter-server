import { ConfigurationService } from './configuration.service';
import { Injectable } from 'injection-js';
import { ExpressService } from './express.service';
import { ExpressRouterService } from './express-router.service';

import engine = require('engine.io');

import * as Jwt from './jwt.service';
import * as winston from 'winston';

import { UsersService } from './users.service';

@Injectable()
export class ApplicationService {
    constructor(
        private usersService: UsersService,
        private expressService: ExpressService,
        private configurationService: ConfigurationService
    ) {
    }

    public start() {
        (<any>winston).level = 'silly';

        winston.log('info', 'Application        | Launching...');

        this.expressService.launch();

        if (this.configurationService.environment.type === 'development') {
            return this.usersService.createStubUsers().catch((reason) => {
                winston.log('error', 'An error occured during users service initialization, reason: "%s"]', reason);

                process.exit(1);
            });
        } else {
            return Promise.resolve();
        }
    }
}
