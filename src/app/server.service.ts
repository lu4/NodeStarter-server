import * as fs from 'fs';
import * as os from 'os';
import * as net from 'net';
import * as http from 'http';
import * as core from 'express-serve-static-core';

import { Injectable } from 'injection-js';
import { ExpressService } from './express.service';
import { ConfigurationService } from './configuration.service';

@Injectable()
export class ServerService {
    private instanceField: net.Server;
    public get instance() {
        return this.instanceField;
    }

    constructor(
        private configurationService: ConfigurationService
    ) {

    }

    public launch(express: core.Express) {
        this.instanceField = http.createServer(express).listen(this.configurationService.environment.port, () => {
            console.log(`Server is up and running @: ${ os.hostname() } on port: ${ this.configurationService.environment.port }`);
            console.log(`enviroment: ${ this.configurationService.environment.type }`);
        });
    }
}
