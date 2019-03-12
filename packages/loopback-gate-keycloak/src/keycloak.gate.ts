// Copyright Shrine Development. 2019. All Rights Reserved.
// Node module: @shrinedev/loopback-gate-keycloak
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { Request, RequestContext } from '@loopback/rest';
import { inject, Setter } from "@loopback/core";
import { Gate } from '@shrinedev/loopback-gate';
import { KeycloakClient } from './keycloak-client';
import { KeycloakBindings } from './keys';
import { UserProfile } from './types';

export class KeycloakGate implements Gate {

  constructor(
    @inject.setter(KeycloakBindings.CURRENT_USER)
    readonly setCurrentUser: Setter<UserProfile>,
    @inject(KeycloakBindings.KEYCLOAK_CLIENT)
    readonly keycloakClient: KeycloakClient
  ) { }

   async gate(context: RequestContext, request: Request): Promise<any> {

    return this.keycloakClient.guard(request, context.response).then((user: UserProfile) => {
      console.log("This is current user", user);
      this.setCurrentUser(user);
    });
  }
}
