import { get, ResponseObject} from '@loopback/rest';
import {inject} from '@loopback/context';
import { KeycloakScreen, KeycloakBindings, UserProfile  } from '@shrinedev/loopback-screen-keycloak';
import { screenWith } from '@shrinedev/loopback-screen';
import { TeamScreen, CURRENT_TEAM, TeamProfile } from '../screens/team.screen';

/**
 * OpenAPI response for me()
 */
const TEAM_RESPONSE: ResponseObject = {
  description: '/teams View Team Response',
  parameters: [{name: 'id', in: 'path', schema: {type: 'string'}}],
  content: {
    'application/json': {
      schema: {
        type: 'object',
        properties: {
          name: {type: 'string'}
        },
      },
    },
  },
};

/**
 * A  controller to demonstrate a LoopBack Keycloak Screen
 */
export class TeamController {
  constructor() {}

  // Map to `GET /me`
  @screenWith(KeycloakScreen, TeamScreen)
  @get('/teams/{id}', {
    responses: {
      '200': TEAM_RESPONSE,
    },
  })
  me(@inject(CURRENT_TEAM) team: TeamProfile): object {
    // Reply with a current team *if* authorized by Keycloak
    return {
        name: team && team.name,
    };
  }

}
