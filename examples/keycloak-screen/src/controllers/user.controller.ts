import { get, ResponseObject} from '@loopback/rest';
import {inject} from '@loopback/context';
import { KeycloakScreen, KeycloakBindings, UserProfile  } from '@shrinedev/loopback-screen-keycloak';
import { LogScreen, screenWith, screenAllWith } from '@shrinedev/loopback-screen';

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
              type: 'string'
            }
          }
        },
      },
    },
  },
};

/**
 * A  controller to demonstrate a LoopBack Keycloak Screen
 */
@screenAllWith(LogScreen)
export class UserController {
  constructor() {}

  // Map to `GET /me`
  @screenWith(KeycloakScreen, LogScreen)
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
        teams: user && user.teams
    };
  }

}
