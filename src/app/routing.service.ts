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
        if (route.checkout) { this.expressRouterService.instance.route(path).checkout(route.checkout); }
        if (route.copy) { this.expressRouterService.instance.route(path).copy(route.copy); }
        if (route.lock) { this.expressRouterService.instance.route(path).lock(route.lock); }
        if (route.merge) { this.expressRouterService.instance.route(path).merge(route.merge); }
        if (route.mkactivity) { this.expressRouterService.instance.route(path).mkactivity(route.mkactivity); }
        if (route.mkcol) { this.expressRouterService.instance.route(path).mkcol(route.mkcol); }
        if (route.move) { this.expressRouterService.instance.route(path).move(route.move); }
        if (route.mSearch) { this.expressRouterService.instance.route(path)['m-search'](route.mSearch); }
        if (route.notify) { this.expressRouterService.instance.route(path).notify(route.notify); }
        if (route.purge) { this.expressRouterService.instance.route(path).purge(route.purge); }
        if (route.report) { this.expressRouterService.instance.route(path).report(route.report); }
        if (route.search) { this.expressRouterService.instance.route(path).search(route.search); }
        if (route.subscribe) { this.expressRouterService.instance.route(path).subscribe(route.subscribe); }
        if (route.trace) { this.expressRouterService.instance.route(path).trace(route.trace); }
        if (route.unlock) { this.expressRouterService.instance.route(path).unlock(route.unlock); }
        if (route.unsubscribe) { this.expressRouterService.instance.route(path).unsubscribe(route.unsubscribe); }
    }
}
