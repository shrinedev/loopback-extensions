import {ShrineApplication} from './application';
import {ApplicationConfig} from '@loopback/core';

export {ShrineApplication};

export async function main(options: ApplicationConfig = {}) {
  const app = new ShrineApplication(options);
  await app.boot();
  await app.start();

  const url = app.restServer.url;
  console.log(`Server is running at ${url}`);
  console.log(`Try ${url}/me`);

  return app;
}
