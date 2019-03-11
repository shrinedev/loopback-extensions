import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {ServiceMixin} from '@loopback/service-proxy';
import * as path from 'path';
import {MySequence} from './sequence';
import { ScreenComponent, LogScreen } from '@shrinedev/loopback-screen';
import { KeycloakScreen, KeycloakClient, KeycloakBindings } from '@shrinedev/loopback-screen-keycloak';
import { TeamScreen } from './screens/team.screen';

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
    
    this.component(ScreenComponent);

    ScreenComponent.createBindings(KeycloakScreen, LogScreen, TeamScreen).forEach(binding => this.add(binding));
  
    // For Keycloak Screen we need provide an instance of the client

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
