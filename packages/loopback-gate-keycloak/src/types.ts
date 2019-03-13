// Copyright Shrine Development. 2019. All Rights Reserved.
// Node module: @shrinedev/loopback-gate-keycloak
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

/**
 * interface definition of a user profile
 * http://openid.net/specs/openid-connect-core-1_0.html#StandardClaims
 */
import * as Keycloak from 'keycloak-connect';


export interface UserProfile {
    id: string;
    name?: string;
    email?: string;
    teams?: Array<string>;
  }

export class KeycloakIdTokenContent implements Keycloak.TokenContent {
  exp: number;
  resource_access?: any;
  realm_access?: { roles?: string[] | undefined; } | undefined;

  email: string;
  sub: string;
  family_name: string;
  given_name: string;
    groups: any;
}

export { Keycloak }

