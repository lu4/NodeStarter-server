import * as core from 'express-serve-static-core';

export interface IRoute {
    all: core.RequestHandler | null;
    get: core.RequestHandler | null;
    post: core.RequestHandler | null;
    put: core.RequestHandler | null;
    delete: core.RequestHandler | null;
    patch: core.RequestHandler | null;
    options: core.RequestHandler | null;
    head: core.RequestHandler | null;
    checkout: core.RequestHandler | null;
    copy: core.RequestHandler | null;
    lock: core.RequestHandler | null;
    merge: core.RequestHandler | null;
    mkactivity: core.RequestHandler | null;
    mkcol: core.RequestHandler | null;
    move: core.RequestHandler | null;
    mSearch: core.RequestHandler | null;
    notify: core.RequestHandler | null;
    purge: core.RequestHandler | null;
    report: core.RequestHandler | null;
    search: core.RequestHandler | null;
    subscribe: core.RequestHandler | null;
    trace: core.RequestHandler | null;
    unlock: core.RequestHandler | null;
    unsubscribe: core.RequestHandler | null;
}

export class Route implements IRoute {
    all: core.RequestHandler | null = null;
    get: core.RequestHandler | null = null;
    post: core.RequestHandler | null = null;
    put: core.RequestHandler | null = null;
    delete: core.RequestHandler | null = null;
    patch: core.RequestHandler | null = null;
    options: core.RequestHandler | null = null;
    head: core.RequestHandler | null = null;
    checkout: core.RequestHandler | null = null;
    copy: core.RequestHandler | null = null;
    lock: core.RequestHandler | null = null;
    merge: core.RequestHandler | null = null;
    mkactivity: core.RequestHandler | null = null;
    mkcol: core.RequestHandler | null = null;
    move: core.RequestHandler | null = null;
    mSearch: core.RequestHandler | null = null;
    notify: core.RequestHandler | null = null;
    purge: core.RequestHandler | null = null;
    report: core.RequestHandler | null = null;
    search: core.RequestHandler | null = null;
    subscribe: core.RequestHandler | null = null;
    trace: core.RequestHandler | null = null;
    unlock: core.RequestHandler | null = null;
    unsubscribe: core.RequestHandler | null = null;
}
