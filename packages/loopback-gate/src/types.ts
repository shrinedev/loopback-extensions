// Copyright Shrine Development. 2017,2018. All Rights Reserved.
// Node module: @shrinedev/loopback-gate
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { Request, RequestContext } from '@loopback/rest';
import { Class } from '@loopback/repository';

/**
 * interface definition of a function which accepts 
 * a request and gates it
 */
export interface GateRequestFn {
  (context: RequestContext, request: Request): Promise<any | undefined>;
}

export interface GateFn {
  (request: Request): Promise<any | undefined>;
}

export interface GateMetadata {
  gates: Array<Class<Gate>>;
  options?: Object;
}

/**
 * A Request Gate
 */
export interface Gate {
  gate(context: RequestContext, request: Request): Promise<any>;
}

