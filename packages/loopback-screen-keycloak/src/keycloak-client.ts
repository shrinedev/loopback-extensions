// Copyright Shrine Development. 2019. All Rights Reserved.
// Node module: @shrinedev/loopback-screen-keycloak
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import * as Keycloak from 'keycloak-connect';
import { RequestHandler, Request, Response } from 'express';
import * as cookie from 'cookie';
import { KeycloakClientConfig } from './keycloak-client-config';
import { MiddlewareRunner } from '@shrinedev/middleware-runner';

const cookieParser = require('cookie-parser');

import cookieSession = require('cookie-session');
import { UserProfile } from './types';

const cookieSessionOptions = {
  secret: "CHANGE_ME",
  name: 'keycloak',
  path: '/',
  httpOnly: true,
  secure: false,
  maxAge: 3600000
};

const cookieStoreSession = cookieSession(cookieSessionOptions);


class KeycloakIdTokenContent implements Keycloak.TokenContent {
    exp: number;
    resource_access?: any;
    realm_access?: { roles?: string[] | undefined; } | undefined;

    email: string;
    sub: string;
    family_name: string;
    given_name: string;
}


/**
 * Keycloak Client is a modified version of the keycloak Connect package
 * that is designed to use cookies to store grants
 */

export class KeycloakClient extends Keycloak {
    stores: Array<any>;

    constructor(keycloakConfig: KeycloakClientConfig) {
        super({}, keycloakConfig);

        // KeycloakConnect's built-in Session Store is not compatible with a fully
        // Cookie-based session. Addtionally, the KeycloakConnect Constructor takes any stores
        // provided and wraps them in another store. We avoid this by assigning to the stores directly.
        this.stores.push(new CookieSessionStore());
    }

    middlewares(): [RequestHandler] {
        return super.middleware() as unknown as [RequestHandler];
    }

    async guard(request: Request, response: Response): Promise<any | undefined> {

        // Prepare Keycloak Connects protect middleware
        const protect = super.protect();

        const getUser = (request: Keycloak.GrantedRequest, response: Response, next: any) => {
            let user: UserProfile;

            const grant = request.kauth.grant;
            
            if (grant) {
                const idToken: KeycloakIdTokenContent = grant.id_token.content as KeycloakIdTokenContent;
                user = { id: idToken.sub, email: idToken.email, name: `${idToken.given_name} ${idToken.family_name}` };
            } else {
                throw Error("No Grant Provided");
            }
            
            return next(null, user);
        }
        
        const middlewareRunner = new MiddlewareRunner(
            // @ts-ignore
            [cookieStoreSession].concat(this.middlewares(), protect, getUser)
        );

        const result = middlewareRunner.run(request, response);
        return result;
    }
}


const KEYCLOAK_COOKIE_ACCESS_TOKEN = 'keycloak_access_token';
const KEYCLOAK_COOKIE_REFRESH_TOKEN = 'keycloak_refresh_token';
const KEYCLOAK_COOKIE_ID_TOKEN = 'keycloak_id_token';

class CookieSessionStore {

    get(request: Request) {
        let cookiesStr = request.headers.cookie || "";
        const cookies = cookie.parse(cookiesStr);
      
        if (!cookies.keycloak_access_token) {
            return undefined;
        }

        console.log('This is the session', request.session);

        // The keycloak connect raw representation of Grant
        // Requires fields be named appropriately.
        const result = { 
            access_token: cookies[KEYCLOAK_COOKIE_ACCESS_TOKEN], 
            refresh_token: cookies[KEYCLOAK_COOKIE_REFRESH_TOKEN], 
            id_token: cookies[KEYCLOAK_COOKIE_ID_TOKEN]  
        };
      
        return result;

      }

    static store(grant: Keycloak.Grant) {
        return (request: Request, response: Response) => {
            if (!request.session) { throw Error("Request needs a session"); }

            const rawGrant = JSON.parse(grant.__raw);

            let options = {
                maxAge: 1000 * 60 * 60 * 24 * 365, // would expire after 1 year
                httpOnly: true, // The cookie only accessible by the web server
                signed: false // Indicates if the cookie should be signed
            }
            
            response.cookie(KEYCLOAK_COOKIE_ACCESS_TOKEN, rawGrant.access_token, options);
            response.cookie(KEYCLOAK_COOKIE_REFRESH_TOKEN, rawGrant.refresh_token, options);
            response.cookie(KEYCLOAK_COOKIE_ID_TOKEN, rawGrant.id_token, options);

            
            request.session.access_token = rawGrant.access_token;
            request.session.refresh_token = rawGrant.refresh_token;
            request.session.id_token = rawGrant.id_token;
            request.session.save();
        }
    }


    wrap(grant: Keycloak.Grant) {
        if (grant) {
            grant.store = CookieSessionStore.store(grant);

            // @ts-ignore
           // grant.unstore = CookieStore.unstore;
        }
    }

}