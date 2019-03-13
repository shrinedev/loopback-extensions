// Copyright Shrine Development. 2019. All Rights Reserved.
// Node module: @shrinedev/loopback-screen-keycloak
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { RequestHandler, Request, Response } from 'express';
import { KeycloakClientConfig } from './keycloak-client-config';
import { MiddlewareRunner } from '@shrinedev/middleware-runner';
import { UserProfile, Keycloak, KeycloakIdTokenContent } from './types';
import { CookieSessionStore } from './cookie-session-store';

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

    middlewares(): Array<RequestHandler> {
        return super.middleware() as unknown as Array<RequestHandler>;
    }

    async guard(request: Request, response: Response): Promise<any | undefined> {

        // Prepare KeycloakConnect's protect middleware
        const protect = super.protect();

        const getUser = (request: Keycloak.GrantedRequest, response: Response, next: any) => {
            let user: UserProfile;

            const grant = request.kauth.grant;
            
            if (grant) {
                const tokenContent: KeycloakIdTokenContent = grant.access_token.content as KeycloakIdTokenContent;
                user = { id: tokenContent.sub, email: tokenContent.email, name: `${tokenContent.given_name} ${tokenContent.family_name}`, teams: tokenContent.groups };
            } else {
                throw Error("No Grant Provided");
            }
            
            return next(null, user);
        }
        
        const middlewareRunner = new MiddlewareRunner(
            CookieSessionStore.middleware.concat(this.middlewares(), protect, getUser)
        );

        const result = middlewareRunner.run(request, response);
        return result;
    }
}
