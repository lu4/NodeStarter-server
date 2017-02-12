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
}
