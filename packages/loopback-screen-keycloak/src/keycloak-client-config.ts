// Copyright Shrine Development. 2019. All Rights Reserved.
// Node module: @shrinedev/loopback-screen-keycloak
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

const exportedKeycloakClientConfig = {
    "realm": "master",
    "auth-server-url": "http://127.0.0.1:8081/auth",
    "ssl-required": "external",
    "resource": "account",
    "credentials": {
        "secret": "c83ef58c-6b77-4e45-98ef-8b6d3bcfc22b"
    },
    "use-resource-role-mappings": true,
    "confidential-port": 0
};


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