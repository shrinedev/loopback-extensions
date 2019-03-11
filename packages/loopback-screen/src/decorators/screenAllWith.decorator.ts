// Copyright Shrine Development. 2017,2018. All Rights Reserved.
// Node module: @shrinedev/loopback-screen
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {
    MetadataInspector,
    Constructor,
    ClassDecoratorFactory,
  } from '@loopback/context';

import { Screen, ScreenMetadata } from "../types";
import { SCREEN_CLASS_METADATA_KEY } from "../keys";
import { Class } from '@loopback/repository';

  /**
   * Set Screen metadata on a class
   *
   * @param screens Classes that implement Screen Interface.
   */
  export function screenAllWith(...screens: Array<Constructor<Screen>>): any {
    
    return ScreenWithClassDecoratorFactory.createDecorator<ScreenMetadata>(
      SCREEN_CLASS_METADATA_KEY,
      {
        screens
      },
    );
  }
  
  /**
   * Fetch screen metadata stored by `@screenAllWith` decorator.
   *
   * @param controllerClass Target controller
   */
  export function getScreenClassMetadata(
    controllerClass: Constructor<{}>,
  ): ScreenMetadata | undefined {
  
    // console.log("Getting Cscreen class data for")
  
    return MetadataInspector.getClassMetadata<ScreenMetadata>(
      SCREEN_CLASS_METADATA_KEY,
      controllerClass,
    );
  }
  
  function isScreenMetadata(obj: any): obj is ScreenMetadata {
    return obj && obj.screens && Array.isArray(obj.screens);
  }
  
  function combinescreenProp(obj1: ScreenMetadata, obj2: ScreenMetadata): Array<Class<Screen>> {
    return obj1.screens.concat(obj2.screens);
  }
  
  class ScreenWithClassDecoratorFactory<T> extends ClassDecoratorFactory<T> {
  
    /**
   * Inherit metadata from base classes. By default, this method merges base
   * metadata into the spec if `allowInheritance` is set to `true`. To customize
   * the behavior, this method can be overridden by sub classes.
   *
   * @param inheritedMetadata Metadata from base classes for the member
   */
    protected inherit(inheritedMetadata: T | undefined | null): T {
  
      if (isScreenMetadata(this.spec) && isScreenMetadata(inheritedMetadata)) {
        let combinedscreens: ScreenMetadata = {
          screens: combinescreenProp(inheritedMetadata, this.spec)
        };
        return Object.assign(inheritedMetadata, this.spec, combinedscreens);
      }
  
      return super.inherit(inheritedMetadata);
    }
  }
  