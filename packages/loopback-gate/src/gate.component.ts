// Copyright Shrine Development. 2017,2018. All Rights Reserved.
// Node module: @shrinedev/loopback-gate
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {Component, ProviderMap, ClassMap, createBindingFromClass, Binding} from '@loopback/core';
import { GateBindings } from './keys';
import { GateActionProvider } from './providers/gate-action.provider';
import { Class } from '@loopback/repository';
import { Gate } from './types';

export class GateComponent implements Component {
  providers?: ProviderMap;
  classes?: ClassMap;
  bindings?: Binding[];
  
  constructor() {
    this.providers = {
      [GateBindings.GATE_ACTION_PROVIDER.key]: GateActionProvider
    };
  }

  static createBindings(...gates: Class<Gate>[]): Binding[] {
    return gates.map(s => createBindingFromClass(s));
  }
}

