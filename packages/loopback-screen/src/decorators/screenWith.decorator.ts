// Copyright Shrine Development. 2017,2018. All Rights Reserved.
// Node module: @shrinedev/loopback-screen
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {
    MetadataInspector,
    Constructor,
    MethodDecoratorFactory,
  } from '@loopback/context';
import { ScreenMetadata, Screen } from '../types';
import { SCREEN_METADATA_KEY } from '../keys';
  
  
  /**
   * Set Screen metadata on a method
   *
   * @param screenClass A class that implements Screen Interface.
   * @param methodName Target method
   */
  export function screenWith<T extends Screen>(screenClass: new (...args: any[]) => T, options = {}) {
  
    return MethodDecoratorFactory.createDecorator<ScreenMetadata>(
      SCREEN_METADATA_KEY,
      {
        screens: [screenClass],
        options: options,
      },
    );
  }
  
  /**
   * Fetch screen metadata stored by `@screenWith` decorator.
   *
   * @param controllerClass Target controller
   * @param methodName Target method
   */
  export function getScreenMethodMetadata(
    controllerClass: Constructor<{}>,
    methodName: string,
  ): ScreenMetadata | undefined {
    return MetadataInspector.getMethodMetadata<ScreenMetadata>(
      SCREEN_METADATA_KEY,
      controllerClass.prototype,
      methodName,
    );
  }
  