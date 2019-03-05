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
          id: {type: 'string'}
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
  constructor(@inject(KeycloakBindings.CURRENT_USER) private user: UserProfile) {}

  // Map to `GET /me`
  @screenWith(KeycloakScreen)
  @get('/auth/me', {
    responses: {
      '200': ME_RESPONSE,
    },
  })
  me(): object {
    // Reply with a current user authorized by Keycloak
    return {
        email: this.user.email,
        id: this.user.id,
        name: this.user.name
    };
  }
}
