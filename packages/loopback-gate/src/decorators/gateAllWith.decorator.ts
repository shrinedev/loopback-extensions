// Copyright Shrine Development. 2017,2018. All Rights Reserved.
// Node module: @shrinedev/loopback-gate
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {
    MetadataInspector,
    Constructor,
    ClassDecoratorFactory,
  } from '@loopback/context';

import { Gate, GateMetadata } from "../types";
import { GATE_CLASS_METADATA_KEY } from "../keys";
import { Class } from '@loopback/repository';

  /**
   * Set Gate metadata on a class
   *
   * @param gates Classes that implement Gate Interface.
   */
  export function gateAllWith(...gates: Array<Constructor<Gate>>): any {
    
    return GateWithClassDecoratorFactory.createDecorator<GateMetadata>(
      GATE_CLASS_METADATA_KEY,
      {
        gates
      },
    );
  }
  
  /**
   * Fetch gate metadata stored by `@gateAllWith` decorator.
   *
   * @param controllerClass Target controller
   */
  export function getGateClassMetadata(
    controllerClass: Constructor<{}>,
  ): GateMetadata | undefined {
  
    // console.log("Getting Cgate class data for")
  
    return MetadataInspector.getClassMetadata<GateMetadata>(
      GATE_CLASS_METADATA_KEY,
      controllerClass,
    );
  }
  
  function isGateMetadata(obj: any): obj is GateMetadata {
    return obj && obj.gates && Array.isArray(obj.gates);
  }
  
  function combineGateProp(obj1: GateMetadata, obj2: GateMetadata): Array<Class<Gate>> {
    return obj1.gates.concat(obj2.gates);
  }
  
  class GateWithClassDecoratorFactory<T> extends ClassDecoratorFactory<T> {
  
    /**
   * Inherit metadata from base classes. By default, this method merges base
   * metadata into the spec if `allowInheritance` is set to `true`. To customize
   * the behavior, this method can be overridden by sub classes.
   *
   * @param inheritedMetadata Metadata from base classes for the member
   */
    protected inherit(inheritedMetadata: T | undefined | null): T {
  
      if (isGateMetadata(this.spec) && isGateMetadata(inheritedMetadata)) {
        let combinedgates: GateMetadata = {
          gates: combineGateProp(inheritedMetadata, this.spec)
        };
        return Object.assign(inheritedMetadata, this.spec, combinedgates);
      }
  
      return super.inherit(inheritedMetadata);
    }
  }
  