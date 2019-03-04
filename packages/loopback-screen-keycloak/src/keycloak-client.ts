// Copyright Shrine Development. 2019. All Rights Reserved.
// Node module: @shrinedev/loopback-screen-keycloak
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import * as Keycloak from 'keycloak-connect';
import { RequestHandler, Request, Response } from 'express';
import * as cookie from 'cookie';
import { KeycloakClientConfig } from './keycloak-client-config';
import { MiddlewareRunner } from '@shrinedev/middleware-runner';

const mockUser = { id: "8888", name: "Leox Drouillard", email: "leox@shrinedev.com" };

/**
 * Keycloak Client is a modified version of the keycloak Connect package
 * that is designed to use cookies to store grants
 */
class CookieStore {

     static store(grant: Keycloak.Grant) {
        return (request: Request, response: Response) => {
            const rawGrant = JSON.parse(grant.__raw);
    
            let options = {
                maxAge: 1000 * 60 * 60 * 24 * 365, // would expire after 1 year
                httpOnly: true, // The cookie only accessible by the web server
                signed: false // Indicates if the cookie should be signed
            }
    
            response.cookie('keycloak_access_token', rawGrant.access_token, options);
            response.cookie('keycloak_refresh_token', rawGrant.refresh_token, options);
            response.cookie('keycloak_id_token', rawGrant.id_token, options);
            response.cookie('keycloak_expires_in', rawGrant.expires_in, options);
            response.cookie('keycloak_token_type', rawGrant.token_type, options);
    
        }
    }

    static unstore(request: Request, response: Response) {
        response.clearCookie('keycloak_access_token');
        response.clearCookie('keycloak_refresh_token');
        response.clearCookie('keycloak_id_token');
        response.clearCookie('keycloak_expires_in');
        response.clearCookie('keycloak_token_type');
      }

    get(request: Request) {
        const cookies = request.headers.cookie || "";
        const parsedCookies = cookie.parse(cookies);

        const { keycloak_access_token: access_token,
            keycloak_refresh_token: refresh_token,
            keycloak_id_token: id_token,
            keycloak_expires_in: expires_in,
            keycloak_token_type: token_type } = parsedCookies;

        return { access_token, refresh_token, id_token, expires_in, token_type };
    }

    wrap(grant: Keycloak.Grant) {
        if (grant) {
            grant.store = CookieStore.store(grant);

            // @ts-ignore
            grant.unstore = CookieStore.unstore;
        }
    }

    clear() {
        throw Error("Not used. Not implemented.");
    }

}

export class KeycloakClient extends Keycloak {

    constructor(keycloakConfig: KeycloakClientConfig) {
        super({ store: new CookieStore() }, keycloakConfig);
    }

    middlewares(): [RequestHandler] {
        return super.middleware() as unknown as [RequestHandler];
    }

    async guard(request: Request, response: Response): Promise<any | undefined> {

        // Prepare Keycloak Connects protect middleware
        const protect = super.protect();
    
        const getUser = () => {
            return mockUser;
        }

        // @ts-ignore
        const middlewareRunner = new MiddlewareRunner(this.middlewares().concat(protect, getUser));
        return  middlewareRunner.run;
    }
}


