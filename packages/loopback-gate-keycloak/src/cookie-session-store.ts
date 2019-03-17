import { Keycloak } from "./types";
import { Request, Response, RequestHandler } from 'express';
import * as zlib from 'zlib';

import cookieSession = require('cookie-session');

const KEYCLOAK_STORAGE_COOKIE = 'keycloak_grant';

export class CookieSessionStore {

    static middleware: Array<RequestHandler> = [cookieSession({
        secret: process.env['COOKIE_SECRET'],
        name: 'keycloak',
        path: '/',
        httpOnly: true,
        secure: false,
        maxAge: 3600000
      })];

    get(request: Request) {
        if (!request.session) { throw Error("A session is required to get grant.")}

        const defaltedGrant = request.session[KEYCLOAK_STORAGE_COOKIE];

        if (!defaltedGrant) { return undefined }

        return zlib.inflateSync(Buffer.from(defaltedGrant, 'base64')).toString();
    }

    static store(grant: Keycloak.Grant) {
        return (request: Request, response: Response) => {
            if (!request.session) { throw Error("A session is required to store grant.")}
            const defaltedGrant =  zlib.deflateSync(grant.__raw).toString('base64');
            request.session[KEYCLOAK_STORAGE_COOKIE] = defaltedGrant;
        }
    }

    wrap(grant: Keycloak.Grant) {
        if (grant) {
            grant.store = CookieSessionStore.store(grant);
        }
    }

}
