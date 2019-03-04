// Copyright Shrine Development. 2019. All Rights Reserved.
// Node module: @shrinedev/loopback-screen-keycloak
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { Request, RequestContext } from '@loopback/rest';
import { inject, Setter } from "@loopback/core";
import { Screen } from '@shrinedev/loopback-screen';
import { KeycloakClient } from './keycloak-client';
import { KeycloakBindings } from './keys';
import { UserProfile } from './types';

export class KeycloakScreen implements Screen {

  constructor(
    @inject.setter(KeycloakBindings.CURRENT_USER)
    readonly setCurrentUser: Setter<UserProfile>,
    @inject(KeycloakBindings.KEYCLOAK_CLIENT_PROVIDER)
    readonly keycloakClient: KeycloakClient
  ) { }

   async screen(context: RequestContext, request: Request) {

    const user = await this.keycloakClient.guard(request, context.response).then(value => {
        this.setCurrentUser(value);
    });
  }
}
