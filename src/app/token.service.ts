import { JwtService } from './jwt.service';
import { Injectable } from 'injection-js';

import { Avl } from './avl/kv';
import { TimeService } from './time.service';
import { UuidService } from './uuid.service';

const infinity = Number.POSITIVE_INFINITY;

export interface Token {
    id: string;
    expires: number;
    address: string;
    username: string;
}

@Injectable()
export class TokenService {
    private timerId: any;
    private resolution: number;
    private tokensById: Map<string, Token> = new Map();
    private tokensByTime: Avl<number, Set<string>> = new Avl<number, Set<string>>((a: number, b: number) => a - b);

    constructor(
        private jwtService: JwtService,
        private uuidService: UuidService,
        private timeService: TimeService
    ) {
    }

    public launch(resolution: number) {
        if (this.timerId) {
            throw new Error('TokenService already launched');
        }

        this.timerId = this.timeService.setInterval(() => {
            let moments: number[] = [];

            this.tokensByTime.iterateForward(-infinity, (tokens, moment) => {
                tokens.forEach(token => {
                    this.tokensById.delete(token);
                });

                moments.push(moment);
            });

            moments.forEach(moment => {
                this.tokensByTime.remove(moment);
            });
        }, this.resolution = resolution);
    }

    public register(id: string, expires: number, username: string, address: string) {
        let token: Token = { id, address, username, expires };

        this.tokensById.set(id, token);

        let requests = this.tokensByTime.get(expires)
              || this.tokensByTime.set(expires, new Set<string>());

        requests.add(id);
    }

    public verify(id: string | null | undefined, address: string): Token | null {
        if (id) {
            let token = this.tokensById.get(id);

            if (token) {
                if (token.address) {
                    if (token.address !== address) {
                        return null;
                    }
                }

                if (token.expires <= Date.now()) {
                    return null;
                }

                let tokens = this.tokensByTime.get(token.expires);

                if (tokens) {
                    tokens.delete(id);

                    if (tokens.size < 1) {
                        this.tokensByTime.remove(token.expires);
                    }
                }

                this.tokensById.delete(id);

                return token;
            }
        }

        return null;
    }
}
