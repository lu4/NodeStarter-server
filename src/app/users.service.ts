import { Injectable } from 'injection-js';

import * as crypto from 'crypto';
import * as process from 'process';

export interface Auth {
    token: string;

    username: string;
    password: string;
}

export class User {
    public constructor(
        public username: string,
        public password: string,
        public salt: string,
        public createdOn: number
    ) {
    }
}

@Injectable()
export class UsersService {
    private usersByUsername: Map<string, User> = new Map();

    constructor() {
    }

    public createStubUsers() {
        return Promise.all([
            this.create('test', 'test'),
            this.create('test0', 'test0'),
            this.create('test1', 'test1'),
            this.create('test2', 'test2'),
            this.create('test3', 'test3')
        ]);
    }

    public verify(password: string, hash: string, salt: string): boolean {
        let sha512 = crypto.createHmac('sha512', salt);

        sha512.update(password);

        return hash === sha512.digest('hex');
    }

    public create(username: string, password: string): Promise<User> {
        if (this.usersByUsername.has(username)) {
            return Promise.reject('Username already exists');
        } else {
            let salt = crypto.randomBytes(16).toString('hex');
            let sha512 = crypto.createHmac('sha512', salt);

            sha512.update(password);

            let hash = sha512.digest('hex');
            let user = new User(username, hash, salt, Date.now());

            this.usersByUsername.set(user.username, user);

            return Promise.resolve(user);
        }
    }

    public findByUsername(username: string): Promise<User> {
        let user = this.usersByUsername.get(username);

        if (user) {
            return Promise.resolve(user);
        } else {
            return Promise.reject('User not found');
        }
    }
}
