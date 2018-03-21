// Considerations:
// https://blog.jayway.com/2015/04/13/600k-concurrent-websocket-connections-on-aws-using-node-js/
// https://www.tutorialspoint.com/articles/how-to-configure-nginx-as-reverse-proxy-for-websocket
import { connect } from 'tls';

import { Injectable } from 'injection-js';
import { UuidService } from './uuid.service';
import { ServerService } from './server.service';
import { ConfigurationService } from './configuration.service';

import * as Ws from 'ws';
import * as http from 'http';
import * as winston from 'winston';
import * as req from 'request';

import { write, writeFile } from 'fs';


const ClientLoginRejectionEvent = JSON.stringify({ type: 'ClientLoginRejectionEvent' })
const ClientLoginConfirmationEvent = JSON.stringify({ type: 'ClientLoginConfirmationEvent' });

export enum ReadingType
{
    Gps = 0,
    Arkit = 1,
    Motion = 2,
    Heading = 3,
    Bluetooth = 4,
    Gyroscope = 5,
    PointCloud = 6,
    Magnetometer = 7,
    Accelerometer = 8
}

@Injectable()
export class WebSocketService {
    private server: Ws.Server;

    private handleOnConnection = (websocket: Ws, request: http.IncomingMessage) => {
        let id = this.uuidService.generate();

        winston.log('silly', 'WebSocketService:on("connection", ...)', );
        websocket.on('close', () => {
            winston.log('silly', 'WebSocketService:on("close", ...)', id);
        });

        websocket.on('message', async (data: Buffer | string) => {
            if (data instanceof Buffer) {
                winston.log('silly', 'WebSocketService:on("message", ...) Message "%j" received from client "%s"', id, data.toString());
            } else {
                winston.log('silly', 'WebSocketService:on("message", ...) Message "%j" received from client "%s"', id, data);
            }
        });
    }

    public async initialize(): Promise<void> {
        this.server = new Ws.Server(this.configurationService.webSocket);
        this.server.on('connection', this.handleOnConnection);
    }

    public constructor(
        private uuidService: UuidService,
        private configurationService: ConfigurationService
    ) {
    }
}
