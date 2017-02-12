import { ConfigurationService } from './configuration.service';
import { SocketServerService } from './socket-server.service';
import * as net from 'net';
import * as fs from 'fs';
import * as os from 'os';
import * as https from 'https';

import * as core from 'express-serve-static-core';

import { Injectable } from 'injection-js';

import { ExpressService } from './express.service';

@Injectable()
export class ServerService {
    private instance: net.Server | null = null;

    constructor(private configurationService: ConfigurationService, private socketServerService: SocketServerService) {
    }

    public launch(express: core.Express) {
        const opts = {
            key: fs.readFileSync(process.cwd() + this.configurationService.security.certificates.key),
            cert: fs.readFileSync(process.cwd() + this.configurationService.security.certificates.cert)
        };

        this.instance = https.createServer(opts, express).listen(this.configurationService.environment.port, () => {
            console.log(`Server is up and running @: ${ os.hostname() } on port: ${ this.configurationService.environment.port }`);
            console.log(`enviroment: ${ this.configurationService.environment.type }`);
        });

        this.socketServerService.launch(this.instance);
    }
}
