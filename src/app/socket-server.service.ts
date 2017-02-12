import { Injectable } from 'injection-js';

import { JwtService } from './jwt.service';
import { TokenService } from './token.service';
import { UsersService } from './users.service';
import { ConfigurationService } from './configuration.service';

import engine = require('engine.io');

import * as net from 'net';
import * as winston from 'winston';

const AuthenticationFailed = 'Authentication failed';

type Status = 'success' | 'failure';

interface Request<TParameters> {
    uuid: string;
    resource: 'resource'; // TODO: Update list of resource names according to usage
    parameters: TParameters;
}

interface Response<TContent> {
    uuid: string;
    status: Status;
    content: TContent;
}

@Injectable()
export class SocketServerService {
    private instance: engine.Server;

    constructor(
        private jwtService: JwtService,
        private usersService: UsersService,
        private tokenService: TokenService,
        private configurationService: ConfigurationService
    ) {

    }

    private register(socket: engine.Socket, ttl: number, username: string, uuid: string, compress: boolean) {
        winston.log(
            'verbose', 'SocketServer    | Socket "%s" is being registered for username = "%s" and ttl = "%d"', socket.id, username, ttl);

        socket.on('close', () => this.onClose(socket, ttl, username));
        socket.on('message', <TData>(data: TData) => this.onMessage(socket, data));

        return this.respond(
            socket,
            'success',
            uuid,
            // TODO: Send encrypted / hashed socket.id
            this.jwtService.encode(socket.id, this.configurationService.security.jwt.secret),
            compress
        );
    }

    private respond<TContent>(socket: engine.Socket, status: string, uuid: string, content: TContent, compress: boolean) {
        winston.log('verbose', 'SocketServer    | Socket "%s" was sent a  "%s" status message', socket.id, status, content);

        return new Promise((resolve, reject) => {
            socket.send(JSON.stringify(<Response<TContent>>{
                uuid,
                status,
                content: content
            }), { compress }, <T>(value: T) => resolve(value));
        });
    }

    private kill(socket: engine.Socket, uuid: string, message: string) {
        return new Promise((resolve, reject) => {
            winston.log('verbose', 'SocketServer    | Socket "%s" is notified of upcomming disconnect reason', socket.id);
            socket.send(JSON.stringify(<Response<string>>{
                uuid,
                status: 'failure',
                content: message
            }), void 0, function () {
                winston.log(
                    'verbose', 'SocketServer    | Socket "%s" was notified of upcomming disconnect, disconnecting...', socket.id);
                socket.close();
                resolve();
            });
        });
    }

    private reject(socket: engine.Socket, uuid: string, message: string) {
        return this.kill(socket, uuid, message).then(function () {
            return Promise.reject(message);
        });
    }

    private onConnection(socket: engine.Socket, secret: string, compression: boolean) {
        let uuid = <string | undefined> socket.request.headers['z-uuid'];

        if (uuid) {
            let ttl = <number | undefined> socket.request.headers['z-ttl'] || this.configurationService.sockets.ttl;
            let tokenJson = <string | undefined> socket.request.headers['z-token'];

            let username = <string | undefined> socket.request.headers['z-username'];
            let password = <string | undefined> socket.request.headers['z-password'];

            if (username && password) {
                winston.log('verbose', 'SocketServer    | Socket "%s" provided username and password for authentication', socket.id);
                return this.usersService.findByUsername(username).then(user => {
                    return this.usersService.verify(<string>password, user.password, user.salt)
                        ? this.register(socket, ttl, <string>username, <string>uuid, compression)
                        : this.reject(socket, <string>uuid, AuthenticationFailed);
                }, () => this.reject(socket, <string>uuid, AuthenticationFailed));
            } else if (tokenJson) {
                winston.log('verbose', 'SocketServer    | Socket "%s" provided ticket for authentication', socket.id);
                let id = this.jwtService.decode<string>(tokenJson, secret);

                let token = this.tokenService.verify(id, socket.remoteAddress);

                if (token) {
                    winston.log('verbose', 'SocketServer    | Socket "%s" provided valid token, authenticating', socket.id);
                    return this.register(socket, ttl, token.username, uuid, compression);
                }
            }

            return this.reject(socket, uuid, AuthenticationFailed);
        } else {
            socket.close();
            winston.log('verbose', 'SocketServer    | Socket "%s" didn\'t provide uuid, knocking this wierdo out...');

            return Promise.reject(AuthenticationFailed);
        }
    }

    private onMessage<TData>(socket: engine.Socket, data: TData) {
        winston.log('verbose', 'SocketServer    | Socket "%s" is closing...');

        console.log(['message', data, socket]);
    }

    private onClose(socket: engine.Socket, ttl: number, username: string) {
        winston.log('verbose', 'SocketServer    | Socket "%s" is closing, registering return ticket...', socket.id);

        // Register one-time ticket
        this.tokenService.register(socket.id, Date.now() + ttl, username, socket.remoteAddress);
    }

    public launch(server: net.Server) {
        winston.log('info', 'SocketServer       | Launching...');

        if (this.instance) { throw new Error('SocketServer already launched'); }

        this.instance = engine.attach(server);

        this.instance.on('connection', (socket) => {
            winston.log('verbose', 'SocketServer    | Socket "%s" tries to connect', socket.id);
            this.onConnection(
                socket,
                this.configurationService.security.jwt.secret,
                this.configurationService.sockets.compression
            ).then(() => {
                winston.log('verbose', 'SocketServer    | Socket "%s" successfully authenticated', socket.id);
            }, () => {
                winston.log('verbose', 'SocketServer    | Socket "%s" failed to authenticate', socket.id);
            });
        });
    }
}

