// Copyright Shrine Development. 2017,2018. All Rights Reserved.
// Node module: @shrinedev/loopback-screen
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { BindingKey } from '@loopback/context';
import { MetadataAccessor } from '@loopback/metadata';
import { ScreenRequestFn, ScreenMetadata } from './types';
/**
 * Binding keys used by this component.
 */
export namespace ScreenBindings {

  /**
   * Key used to locate the provider of the 
   * function that will initiate the screening process
   */
  export const SCREEN_ACTION_PROVIDER = BindingKey.create<ScreenRequestFn>(
    'screen.function.provider',
  );
}

/**
 * The key used to store screen-related via @loopback/metadata and reflection.
 * These are used to allow the App to determine which screens to apply for a given request
 */
export const SCREEN_METADATA_KEY = MetadataAccessor.create<
  ScreenMetadata,
  MethodDecorator
>('screen.operationsMetadata');

export const SCREEN_CLASS_METADATA_KEY = MetadataAccessor.create<
  ScreenMetadata,
  ClassDecorator
>('screen.operationsClassMetadata');
