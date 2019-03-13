import {get, ResponseObject} from '@loopback/rest';
import {inject} from '@loopback/context';
import {KeycloakGate} from '@shrinedev/loopback-gate-keycloak';
import {gateWith} from '@shrinedev/loopback-gate';
import {TeamGate, CURRENT_TEAM, TeamProfile} from '../gates/team.gate';

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
          name: {type: 'string'},
        },
      },
    },
  },
};

/**
 * A  controller to demonstrate a LoopBack Keycloak Gate
 */
export class TeamController {
  constructor() {}

  // Map to `GET /me`
  @gateWith(KeycloakGate, TeamGate)
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
