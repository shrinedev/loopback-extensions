// Copyright Shrine Development. 2019. All Rights Reserved.
// Node module: @shrinedev/loopback-gate-keycloak
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { BindingKey } from "@loopback/core";
import { KeycloakClient } from "./keycloak-client";
import { UserProfile } from "./types";

export namespace KeycloakBindings {

    /**
     * Key used to locate the provider of the 
     * function that will initiate the gateing process
     */
    export const KEYCLOAK_CLIENT = BindingKey.create<KeycloakClient>(
      'gate.keycloak.client',
    );

    export const CURRENT_USER = BindingKey.create<UserProfile>(
      'gate.keycloak.client.current_user',
    );
  }
  