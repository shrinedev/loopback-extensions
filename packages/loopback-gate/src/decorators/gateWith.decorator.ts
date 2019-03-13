// Copyright Shrine Development. 2017,2018. All Rights Reserved.
// Node module: @shrinedev/loopback-gate
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {
    MetadataInspector,
    Constructor,
    MethodDecoratorFactory,
  } from '@loopback/context';
import { GateMetadata, Gate } from '../types';
import { GATE_METADATA_KEY } from '../keys';
  
  
  /**
   * Set Gate metadata on a method
   *
   * @param gateClass A class that implements Gate Interface.
   * @param methodName Target method
   */
  export function gateWith<T extends Gate>(...gates: Array<Constructor<Gate>>) {

    return MethodDecoratorFactory.createDecorator<GateMetadata>(
      GATE_METADATA_KEY,
      {
        gates
      },
    );
  }
  
  /**
   * Fetch gate metadata stored by `@gateWith` decorator.
   *
   * @param controllerClass Target controller
   * @param methodName Target method
   */
  export function getGateMethodMetadata(
    controllerClass: Constructor<{}>,
    methodName: string,
  ): GateMetadata | undefined {
    return MetadataInspector.getMethodMetadata<GateMetadata>(
      GATE_METADATA_KEY,
      controllerClass.prototype,
      methodName,
    );
  }
  