// Copyright Shrine Development. 2017,2018. All Rights Reserved.
// Node module: @shrinedev/loopback-screen
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { Request, RequestContext } from '@loopback/rest';
import { Class } from '@loopback/repository';

/**
 * interface definition of a function which accepts 
 * a request and screens it
 */
export interface ScreenRequestFn {
  (context: RequestContext, request: Request): Promise<any | undefined>;
}

export interface ScreenFn {
  (request: Request): Promise<any | undefined>;
}

export interface ScreenMetadata {
  screens: Array<Class<Screen>>;
  options?: Object;
}

/**
 * A Request Screen
 */
export interface Screen {
  screen(context: RequestContext, request: Request): Promise<any | undefined>;
}

