// import { svd } from 'node-svd';
import 'reflect-metadata';

import * as winston from 'winston';

import { JwtService } from './app/jwt.service';
import { TimeService } from './app/time.service';
import { UuidService } from './app/uuid.service';
import { ServerService } from './app/server.service';
import { ExpressService } from './app/express.service';
import { RoutingService } from './app/routing.service';
import { WebSocketService } from './app/web-socket.service';
import { ApplicationService } from './app/application.service';
import { ConfigurationService } from './app/configuration.service';

import { IndexRoute } from './app/routes/index.route';
import { ExpressRouterService } from './app/express-router.service';

import { ReflectiveInjector } from 'injection-js';
// ------------------------------------------------------------------------

class Program {
    public static async main(): Promise<void> {
        const injector = ReflectiveInjector.resolveAndCreate([
            ApplicationService,

            JwtService,
            TimeService,
            UuidService,
            ServerService,
            ExpressService,
            RoutingService,
            WebSocketService,
            ConfigurationService,

            IndexRoute,
            ExpressRouterService
        ]);
        //-----------------------------------------
        
        // Entry point
        let server: ApplicationService = injector.get(ApplicationService);
        
        winston.log('info', 'Launching server...');

        await server.start();

        // Eagerly load and initialize services
        let websocketService: WebSocketService = injector.get(WebSocketService);

        await websocketService.initialize();
        
        winston.log('info', 'Launching server...Success!');
    }
}

export default Program.main();
