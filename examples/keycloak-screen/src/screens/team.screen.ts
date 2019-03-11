// Copyright Shrine Development. 2019. All Rights Reserved.
// Node module: @shrinedev/examples
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { Request, RequestContext, param } from '@loopback/rest';
import { inject, Setter, BindingKey, Getter } from "@loopback/core";
import { Screen } from '@shrinedev/loopback-screen';
import { KeycloakBindings, UserProfile } from '@shrinedev/loopback-screen-keycloak';

export class TeamProfile {
    name: string;
}

export const CURRENT_TEAM = BindingKey.create<TeamProfile>(
    'screen.team.current',
);

export class TeamScreen implements Screen {

    constructor(
        @inject.setter(CURRENT_TEAM)
        readonly setCurrentTeam: Setter<TeamProfile>
    ) { }
   
    async screen(context: RequestContext, request: Request): Promise<TeamProfile> {

        const user = context.getSync(KeycloakBindings.CURRENT_USER);

        return new Promise<TeamProfile>(async (resolve, reject) => {
            // Get User teams
            const teams = user.teams;
            const teamName = "acme";

            console.log("teams and team name", user, teams, teamName);

            if (!teams) {
                throw Error("User has no teams");
            }

            // Determine team id based off path
            const team = { name: teamName };

            // See if authorized
            if (!teams.find(t => t === team.name)) {
                throw Error("User not authorized to access this team");
            }

            this.setCurrentTeam(team);

            resolve(team);
        });
    }
}