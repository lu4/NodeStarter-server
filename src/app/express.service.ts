import { ConfigurationService } from './configuration.service';
import { ServerService } from './server.service';
import { Injectable } from 'injection-js';
import { RoutingService } from './routing.service';

import * as winston from 'winston';
import * as bodyParser from 'body-parser';

import helmet = require('helmet');
import morgan = require('morgan');
import express = require('express');

@Injectable()
export class ExpressService {
    public readonly instance = express();

    constructor(
        private serverService: ServerService,
        private routingService: RoutingService
    ) {
    }

    public launch() {
        winston.log('info', 'Express            | Launching...');

        this.instance.use(bodyParser.json());
        this.instance.use(morgan(<any>'dev'));
        this.instance.use(helmet());

        // Setup static routes
        this.instance.use(express.static(process.cwd() + '/frontend'));

        // Setup dynamic routes
        this.instance.use('/', this.routingService.launch());

        this.serverService.launch(this.instance);
    }
}
