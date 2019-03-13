# Keycloak Setup

Setting up [Keycloak](https://www.keycloak.org) can be a challenge. This folder contains a docker-compose file and migrations that can be used to install, configure and run Keycloak so that it can be used with  the demo apps included in this repo.

Credit to [jinnerbichler](https://github.com/jinnerbichler). The original docker setup was published [here](https://github.com/jinnerbichler/blog/tree/master/keycloak_4_spring_boot_2).

## Usage

A shell script is provided

````
./start-keycloak.sh
````

This script runs interactively (not in background) so that logging information is displayed on the console.

## Troubleshooting

If the docker up process works initially but then fails upon a system reboot, or stops working after being idle try removing the docker process associated with Keycloak. You should not have to remove the Postgres DB or the Docker Volume created.

You can remove the Keycloak container by finding it with `ps` and then removing with `docker rm`

````
# Example 

$ docker ps

CONTAINER ID        IMAGE                        COMMAND                  CREATED             STATUS              PORTS                    NAMES
f691b6d9c98f        jboss/keycloak:4.0.0.Final   "/opt/jboss/docker-e…"   4 days ago          Up 3 days           0.0.0.0:8081->8080/tcp   keycloak_keycloak_1

# if not already stopped
$ docker stop f691b6d9c98f

$ docker rm f691b6d9c98f


````

## Further Troubleshooting

If you are in a development environment where docker is not being used for critical processes then it can be helpful to fully reset your docker setup by removing all containers, images and volumes as a troubleshooting technique of last resort.

````
# Warning - this will nuke your docker setup

$ docker container stop $(docker container ls -a -q) && docker system prune -a -f --volumes
````
[Check here for more info on nuking your docker setup.](https://medium.com/the-code-review/clean-out-your-docker-images-containers-and-volumes-with-single-commands-b8e38253c271) 

