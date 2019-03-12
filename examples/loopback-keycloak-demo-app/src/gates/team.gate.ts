// Copyright Shrine Development. 2019. All Rights Reserved.
// Node module: @shrinedev/examples
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {Request, RequestContext, HttpErrors} from '@loopback/rest';
import {inject, Setter, BindingKey} from '@loopback/core';
import {Gate} from '@shrinedev/loopback-gate';
import {KeycloakBindings} from '@shrinedev/loopback-gate-keycloak';
import {ROUTE_BINDING} from '../sequence';

export class TeamProfile {
  name: string;
}

export const CURRENT_TEAM = BindingKey.create<TeamProfile>('gate.team.current');

export class TeamGate implements Gate {
  constructor(
    @inject.setter(CURRENT_TEAM)
    readonly setCurrentTeam: Setter<TeamProfile>,
  ) {}

  async gate(context: RequestContext, request: Request): Promise<TeamProfile> {
    const user = context.getSync(KeycloakBindings.CURRENT_USER);

    return new Promise<TeamProfile>(async (resolve, reject) => {
      // Get User teams
      const teams = user.teams;
      const route = context.getSync(ROUTE_BINDING);
      const teamName = route.pathParams.id;

      console.log('teams and team name', user, teams, teamName);

      if (!teams) {
        throw Error('User has no teams');
      }

      // Determine team id based off path
      const team = {name: teamName};

      // See if authorized
      if (!teams.find(t => t === team.name)) {
        // reject("User not authorized to access this team");
        reject(
          new HttpErrors.Forbidden('User not authorized to access this team'),
        );
      }

      this.setCurrentTeam(team);

      resolve(team);
    });
  }
}
