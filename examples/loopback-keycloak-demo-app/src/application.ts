import { BootMixin } from '@loopback/boot';
import { ApplicationConfig, Binding } from '@loopback/core';
import { RepositoryMixin } from '@loopback/repository';
import { RestApplication } from '@loopback/rest';
import { RestExplorerBindings, RestExplorerComponent } from '@loopback/rest-explorer';
import { ServiceMixin } from '@loopback/service-proxy';
import { GateComponent, LogGate } from '@shrinedev/loopback-gate';
import { KeycloakBindings, KeycloakClient, KeycloakGate } from '@shrinedev/loopback-gate-keycloak';
import * as path from 'path';
import { TeamGate } from './gates/team.gate';
import { MySequence } from './sequence';

const exportedKeycloakClientConfig = {
  realm: 'master',
  'auth-server-url': 'http://127.0.0.1:8081/auth',
  'ssl-required': 'external',
  resource: 'account',
  'use-resource-role-mappings': true,
  'confidential-port': 0,
};

export class ShrineApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // Set up the custom sequence
    this.sequence(MySequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.bind(RestExplorerBindings.CONFIG).to({
      path: '/explorer',
    });

    this.component(RestExplorerComponent);

    this.component(GateComponent);

    GateComponent.createBindings(KeycloakGate, LogGate, TeamGate).forEach(
      (binding: Binding) => this.add(binding),
    );

    // For Keycloak Gate we need provide an instance of the client

    const keycloakClient = new KeycloakClient(exportedKeycloakClientConfig);

    this.bind(KeycloakBindings.KEYCLOAK_CLIENT).to(keycloakClient);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }
}
