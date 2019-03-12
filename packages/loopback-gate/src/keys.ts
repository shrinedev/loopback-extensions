// Copyright Shrine Development. 2017,2018. All Rights Reserved.
// Node module: @shrinedev/loopback-gate
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { BindingKey } from '@loopback/context';
import { MetadataAccessor } from '@loopback/metadata';
import { GateRequestFn, GateMetadata } from './types';
/**
 * Binding keys used by this component.
 */
export namespace GateBindings {

  /**
   * Key used to locate the provider of the 
   * function that will initiate the gateing process
   */
  export const GATE_ACTION_PROVIDER = BindingKey.create<GateRequestFn>(
    'gate.function.provider',
  );
}

/**
 * The key used to store gate-related via @loopback/metadata and reflection.
 * These are used to allow the App to determine which gates to apply for a given request
 */
export const GATE_METADATA_KEY = MetadataAccessor.create<
  GateMetadata,
  MethodDecorator
>('gate.operationsMetadata');

export const GATE_CLASS_METADATA_KEY = MetadataAccessor.create<
  GateMetadata,
  ClassDecorator
>('gate.operationsClassMetadata');
