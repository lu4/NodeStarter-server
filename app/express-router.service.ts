import { Injectable } from 'injection-js';

import express = require('express');

@Injectable()
export class ExpressRouterService {
    public readonly instance = express.Router();

    constructor() {
    }
}
