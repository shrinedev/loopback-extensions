import {get, ResponseObject} from '@loopback/rest';
import {inject} from '@loopback/context';
import {
  KeycloakGate,
  KeycloakBindings,
  UserProfile,
} from '@shrinedev/loopback-gate-keycloak';
import {LogGate, gateWith, gateAllWith} from '@shrinedev/loopback-gate';

/**
 * OpenAPI response for me()
 */
const ME_RESPONSE: ResponseObject = {
  description: '/me Current User Response',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        properties: {
          email: {type: 'string'},
          username: {type: 'string'},
          id: {type: 'string'},
          teams: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
        },
      },
    },
  },
};

/**
 * A  controller to demonstrate a LoopBack Keycloak Gate
 */
@gateAllWith(LogGate)
export class UserController {
  constructor() {}

  // Map to `GET /me`
  @gateWith(KeycloakGate, LogGate)
  @get('/auth/me', {
    responses: {
      '200': ME_RESPONSE,
    },
  })
  me(@inject(KeycloakBindings.CURRENT_USER) user: UserProfile): object {
    // Reply with a current user authorized by Keycloak
    return {
      email: user && user.email,
      id: user && user.id,
      name: user && user.name,
      teams: user && user.teams,
    };
  }
}
