## Shrine Development LoopBack Packages

Packages and components for Loopback 4.


** Warning: Alpha Software **

### LoopBack and Keycloak

[Keycloak](www.keycloak)[https://www.keycloak.org/] is a hosted solution SSO solution. Unlike Auth0.com, Stormpath and Parse there is
no risk that Keycloak could be acquired and shutdown. The packages in this repo allow you to integrate Keycloak into a Loopback 4 App via LoopBack Screens.

#### Apps

A number of example apps are provided to test out the provided packages.

##### LoopBack and Keycloak

A start scripts are provided in the `/examples/keycloak-screen` folder.

##### First Shell Session

In your first shell session / tab fire up Keycloak and Postgres

`./start-keycloak.sh`

In a second shell install the required npm dependencies and start the LoopBack server

`./start.sh`


#### Recommended Editor

We recommend you use Microsoft Visual Code for this and other TypeScript projects. The .vscode folder for this project is intentionally committed to make development and testing easier. 