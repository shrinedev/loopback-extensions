// Copyright Shrine Development. 2017,2018. All Rights Reserved.
// Node module: @shrinedev/loopback-gate
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { CoreBindings } from '@loopback/core';
import { Constructor, Provider, inject, Getter, createBindingFromClass } from '@loopback/context';
import { GateRequestFn, GateMetadata, Gate } from '../types';
import { getGateClassMetadata, getGateMethodMetadata } from '../decorators';
import { Request, RequestContext } from '@loopback/rest';

/**
 * @description Provides class and method gates that should be run for a given request
 * based on the annotations configured in the App.
 */
export class GateActionProvider
  implements Provider<GateRequestFn | undefined> {
  constructor(
    @inject.getter(CoreBindings.CONTROLLER_CLASS)
    private readonly getControllerClass: Getter<Constructor<{}>>,
    @inject.getter(CoreBindings.CONTROLLER_METHOD_NAME)
    private readonly getMethodName: Getter<string>,
  ) { }

  value(): GateRequestFn {
    return (context, request) => this.action(context, request);
  }

  static async getInstancesOfGatesFromMetadata(context: RequestContext, metadata: GateMetadata | undefined): Promise<any | undefined> {
    
    if (!metadata) return;

    const gateKlasses = metadata.gates;

    if (!gateKlasses) return;

    // We are expecting an of Gates
    if (!Array.isArray(gateKlasses)) return;

    return gateKlasses.map(klass => context.get<Gate>(createBindingFromClass(klass).key));
  }

  /**
    * @description The goal is to create a chain of gates and then run the Request and it's Contex
    *  through all of the gates.
  */
  async action(context: RequestContext, request: Request) {
    
    // Array of gates to populate
    let gates: Gate[];

    // Get details of current controller class and method
    let controllerClass = await this.getControllerClass();
    let methodName = await this.getMethodName();

    // Get gates for the current controller class
    const classGatesMetadata = getGateClassMetadata(controllerClass);
    const classGates = await GateActionProvider.getInstancesOfGatesFromMetadata(context, classGatesMetadata);

    // Get gates for the current controller method
    const methodGatesMetadata = getGateMethodMetadata(controllerClass, methodName);
    const methodGates = await GateActionProvider.getInstancesOfGatesFromMetadata(context, methodGatesMetadata);

    // We have class constructors of the desired gates at this point.
    // We do not have the instances that we need.
    // First we evaluate all the constructors and get instances
    gates = await Promise.all([].concat(classGates, methodGates));

    // Once we have instances of each of the gates we can run and await the executions
    // return gates && Promise.all(gates.map(gate => gate && gate.gate(context, request)));
    console.log("gates here", gates);
    await gates.reduce((promise, gate) => promise.then(() => gate.gate(context, request)), Promise.resolve());

   // await runGates(gates, context, request);
  }
}

async function runGates(gates: Array<Gate>, context: RequestContext, request: Request) {
  for(const gate of gates) {
    if (!gate) continue;

    console.log("running gate", gate);
    await gate.gate(context, request);
  }
};
