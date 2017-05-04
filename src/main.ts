import 'reflect-metadata';

import { JwtService } from './app/jwt.service';
import { TimeService } from './app/time.service';
import { UuidService } from './app/uuid.service';
import { TokenService } from './app/token.service';
import { UsersService } from './app/users.service';
import { ServerService } from './app/server.service';
import { ExpressService } from './app/express.service';
import { RoutingService } from './app/routing.service';
import { ApplicationService } from './app/application.service';
import { SocketServerService } from './app/socket-server.service';
import { ConfigurationService } from './app/configuration.service';

import { IndexRoute } from './app/routes/index.route';
import { ExpressRouterService } from './app/express-router.service';

import { ReflectiveInjector } from 'injection-js';

class Program {
    public static main(): void {
        const injector = ReflectiveInjector.resolveAndCreate([
            ApplicationService,

            JwtService,
            TimeService,
            UuidService,
            TokenService,
            UsersService,
            ServerService,
            ExpressService,
            RoutingService,
            SocketServerService,
            ConfigurationService,

            IndexRoute,
            ExpressRouterService
        ]);

        let server = <ApplicationService>injector.get(ApplicationService);

        console.log('Launching server...');
        server.start().then(() => {
            console.log('Server successfully launched!');
        });
    }
}

export default Program.main();
