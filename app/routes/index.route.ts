import * as fs from 'fs';
import * as path from 'path';
import * as core from 'express-serve-static-core';

import express = require('express');

import { Injectable } from 'injection-js';

import { Route } from '../route';

@Injectable()
export class IndexRoute extends Route {
    constructor() {
        super();
    }

    public get = (req: express.Request, res: express.Response) => {
        res.type('.html');

        fs.createReadStream(path.join(process.cwd(), 'frontend/index.html')).pipe(res);
    }
}
