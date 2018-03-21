import { Injectable } from 'injection-js';
import { ExpressRouterService } from './express-router.service';

import { IRoute, Route } from './route';
import { IndexRoute } from './routes/index.route';

import express = require('express');

import * as core from 'express-serve-static-core';

@Injectable()
export class RoutingService extends Route {
    constructor(
        private indexRoute: IndexRoute,
        private expressRouterService: ExpressRouterService
    ) {
        super();
    }

    public launch() {
        // Setup generic routing
        this.setupRoute('/', this.indexRoute);

        return this.expressRouterService.instance;
    }

    private setupRoute(path: string, route: IRoute): void {
        if (route.all) { this.expressRouterService.instance.route(path).all(route.all); }
        if (route.get) { this.expressRouterService.instance.route(path).get(route.get); }
        if (route.post) { this.expressRouterService.instance.route(path).post(route.post); }
        if (route.put) { this.expressRouterService.instance.route(path).put(route.put); }
        if (route.delete) { this.expressRouterService.instance.route(path).delete(route.delete); }
        if (route.patch) { this.expressRouterService.instance.route(path).patch(route.patch); }
        if (route.options) { this.expressRouterService.instance.route(path).options(route.options); }
        if (route.head) { this.expressRouterService.instance.route(path).head(route.head); }
    }
}
