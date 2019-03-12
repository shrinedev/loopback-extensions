// Copyright Shrine Development. 2019. All Rights Reserved.
// Node module: @shrinedev/loopback-gate-keycloak
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

interface Credentials {
    secret: string;
}

export interface KeycloakClientConfig {
    realm: string;
    'auth-server-url': string;
    "ssl-required": string,
    "resource": string,
    "credentials": Credentials,
    "use-resource-role-mappings": boolean,
    "confidential-port": number
}