// Copyright Ben Nadel for original implementation (Original code). Copyright Shrine Development for all else. 2017,2018. All Rights Reserved.
// Original code: https://www.bennadel.com/blog/3260-manually-invoking-express-js-middleware-functions.htm
// Node module: @shrinedev/middleware-runner

import { Request, Response, RequestHandler } from "express";
import * as _ from 'lodash';
const Q = require('q');

export class MiddlewareRunner {
    middlewares: Array<RequestHandler>;

    constructor(middlewares: [RequestHandler]) { 
        this.middlewares = middlewares;
    }

    run(request: Request, response: Response) {
        const middlewares = this.middlewares;

        const promise = _
            // Express automatically collapses all of the middleware into a flat array. As
            // such, we want to flatten the given collection before we reduce it.
            .flattenDeep(middlewares)
            .reduce(
                (chain, handler) => {
                    // If the handler accepts four explicit arguments, it is an error handler;
                    // append it to the promise chain as a catch().
                    if (handler.length === 4) {

                        var tail = chain.catch(
                            (error: Error) => {
                                return (MiddlewareRunner.invokeHandler(handler, [error, request, response]));
                            }
                        );

                        // Otherwise, if the handler accepts three explicit arguments, it is a
                        // normal handler; append it to the promise chain as a then().
                    } else if (handler.length === 3) {

                        var tail = chain.then(
                            () => {
                                return (MiddlewareRunner.invokeHandler(handler, [request, response]));
                            }
                        );

                        // If the handler accepts an unexpected number of arguments, just bypass
                        // it, passing the existing chain onto the next handler.
                    } else {
                        var tail = chain;
                    }

                    return (tail);
                },
                Q.when() // Initial promise chain.
            );

        return (promise);
    }

    // Wrap the given handler invocation in a promise.
    static invokeHandler(handler: RequestHandler, handlerArgs: any[]) {
        var deferred = Q.defer();

        // NOTE: We don't need to worry about synchronous errors during invocation
        // because the handler is already being invoked inside of the Promise handler
        // in the above reduction.
        handler.call(null, ...handlerArgs, deferred.makeNodeResolver());

        return (deferred.promise);
    }

}
