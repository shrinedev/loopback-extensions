// Copyright Shrine Development. 2019. All Rights Reserved.
// Node module: @shrinedev/loopback-screen-keycloak
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { BindingKey } from "@loopback/core";
import { KeycloakClient } from "./keycloak-client";
import { UserProfile } from "./types";

export namespace KeycloakBindings {

    /**
     * Key used to locate the provider of the 
     * function that will initiate the screening process
     */
    export const KEYCLOAK_CLIENT_PROVIDER = BindingKey.create<KeycloakClient>(
      'screen.keycloak.client.provider',
    );

    export const CURRENT_USER = BindingKey.create<UserProfile>(
      'screen.keycloak.client.provider',
    );
  }
  