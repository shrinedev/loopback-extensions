// Copyright Shrine Development. 2019. All Rights Reserved.
// Node module: @shrinedev/loopback-gate-keycloak
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { RequestHandler, Request, Response } from 'express';
import { KeycloakClientConfig } from './keycloak-client-config';
import { MiddlewareRunner } from '@shrinedev/middleware-runner';
import { UserProfile, Keycloak, KeycloakExtendedTokenContent, KeycloakSettings } from './types';
import { CookieSessionStore } from './cookie-session-store';

/**
 * Keycloak Client wraps the Keycloak Connect package
 * that is designed to use cookies to store grants. It uses the 
 * Keycloak connect middleware but runs its in per request manner.
 */
export class KeycloakClient {
    static settings?: KeycloakSettings;

    keycloak: Keycloak;

    constructor(keycloakConfig: KeycloakClientConfig) {

        this.keycloak = new Keycloak({}, keycloakConfig);

        // KeycloakConnect's built-in Session Store is not compatible with a fully
        // Cookie-based session. Addtionally, the KeycloakConnect Constructor takes any stores
        // provided and wraps them in another store. We avoid this by assigning to the stores directly.
        // @ts-ignore
        this.keycloak.stores.push(new CookieSessionStore());
    }

    middlewares(): Array<RequestHandler> {
        return this.keycloak.middleware() as unknown as Array<RequestHandler>;
    }

    static getUser(request: Keycloak.GrantedRequest, response: Response, next: any) {
        const access_token = request.kauth.grant && request.kauth.grant.access_token;
        if (!access_token) { throw Error(`No access token provided in grant. Grant:" ${JSON.stringify(request.kauth.grant)}`); }

        const tokenContent: KeycloakExtendedTokenContent = access_token.content as KeycloakExtendedTokenContent;
        if (!tokenContent) { throw Error(`No content provided in access token. Access token:" ${JSON.stringify(access_token)}`); }

        const user: UserProfile = {
            id: tokenContent.sub,
            email: tokenContent.email,
            name: `${tokenContent.given_name} ${tokenContent.family_name}`,
            teams: tokenContent.groups // Requires Keycloak server configured to provide groups via Group Membership Mapper
        };

        // const userAttributes = KeycloakClient.settings && KeycloakClient.settings.attributes;

        // if (userAttributes) {
        //     user.attributes = {};
        //     for (var i = 0; i < userAttributes.length; i++) {

        //         // Iterate through specified settings and assign to user
        //         const key = userAttributes[i];
        //         const value: any = tokenContent[key];
        //         if (value) {
        //             user.attributes[key] = value;
        //         }
        //     }
        // }

        return next(null, user);
    }

    async guard(request: Request, response: Response): Promise<any | undefined> {
        // Prepare KeycloakConnect's protect middleware
        const protect = this.keycloak.protect();

        const middlewareRunner = new MiddlewareRunner(
            CookieSessionStore.middleware.concat(this.middlewares(), protect, KeycloakClient.getUser)
        );

        return middlewareRunner.run(request, response);
    }
}
