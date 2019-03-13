## LoopBack Extensions

Packages and components for Loopback 4.

**Warning: Alpha Software**

## Extensions ##

* **Gates**  Methods that as filters for LoopBack controllers. A modern take on middleware.
* **Keycloak Gate** A Gate that integrates [Keycloak](https://www.keycloak.org/) into a LoopBack App
* **Middleware Runner** - A package that allows Express Middelware to be run outside of Express. Used as a bridge between existing Middleware and Gates.


## Apps

A number of example apps are provided to test out the provided packages.

### LoopBack / Keycloak Demo App

[Keycloak](https://www.keycloak.org/) is a hosted solution SSO solution. Unlike Auth0.com, Stormpath and Parse there is
no risk that Keycloak could be acquired and shutdown. The packages in this repo allow you to integrate Keycloak into a Loopback 4 App via LoopBack Gates.

#### Running the App

Shell scripts are provided to help run the Keycloak server and the Loopback demo App.


##### First Shell Session

In your first shell session / tab fire up Keycloak and Postgres. It is run interactively to make logging available in the console. This setup could be modified to run in the background or deployed to a server.

````
$ cd keycloak
$ ./start-keycloak.sh
````

In a second shell install the required npm dependencies and start the LoopBack server

````
$ cd examples/loopback-keycloak-demo-app
$ ./start.sh
````


### Recommended Editor

We recommend [Microsoft Visual Code](https://code.visualstudio.com/) for editing. The .vscode folder for this project is intentionally committed to make development and testing easier. 
