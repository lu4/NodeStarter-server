import { Injectable } from 'injection-js';

@Injectable()
export class ConfigurationService {
    sockets = {
        ttl: 1000 * 60 * 60 * 24 * 30,
        compression: false,
    };

    security = {
        certificates: {
            key: '/certificates/server.key',
            cert: '/certificates/server.crt'
        },
        jwt: {
            secret: '5BD692F61942FA73F2D9CB98AB8A86D1C22972940578C29F3316F79C392B323893967C217F90FF07E466BC364E6A56C433FA8C0DD6048F77AD8665'
            + '01FC5101FA',
            expiresIn: 1000 * 60 * 60 // Jwt is considered valid only for one hour after client disconnects
        }
    };

    environment = {
        get type(): 'production' | 'development' {
            let environment = process.env.npm_config_NODE_ENV;
            switch (environment) {
                case 'production':
                case 'development':
                    return environment;
                case undefined:
                    return 'production';
                default:
                    throw new Error(
                        `Unknown environment "${environment}" provided, only "production" and "development" are supported`
                    );
            }
        },

        get port() {
            if (process.env.npm_config_PORT) {
                return +process.env.npm_config_PORT;
            }

            return 3333;
        }
    };
}
