// Copyright Shrine Development. 2017,2018. All Rights Reserved.
// Node module: @shrinedev/loopback-screen
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { CoreBindings } from '@loopback/core';
import { Constructor, Provider, inject, Getter, createBindingFromClass } from '@loopback/context';
import { ScreenRequestFn, ScreenMetadata, Screen } from '../types';
import { getScreenClassMetadata, getScreenMethodMetadata } from '../decorators';
import { Request, RequestContext } from '@loopback/rest';

/**
 * @description Provides class and method screens that should be run for a given request
 * based on the annotations configured in the App.
 */
export class ScreenActionProvider
  implements Provider<ScreenRequestFn | undefined> {
  constructor(
    @inject.getter(CoreBindings.CONTROLLER_CLASS)
    private readonly getControllerClass: Getter<Constructor<{}>>,
    @inject.getter(CoreBindings.CONTROLLER_METHOD_NAME)
    private readonly getMethodName: Getter<string>,
  ) { }

  value(): ScreenRequestFn {
    return (context, request) => this.action(context, request);
  }


  static async getInstancesOfScreensFromMetadata(context: RequestContext, metadata: ScreenMetadata | undefined): Promise<any | undefined> {
    
    if (!metadata) return;

    const screenKlasses = metadata.screens;

    if (!screenKlasses) return;

    // We are expecting an of Screens
    if (!Array.isArray(screenKlasses)) return;

    return screenKlasses.map(klass => context.get<Screen>(createBindingFromClass(klass).key));
  }

  /**
    * @description The goal is to create a chain of screens and then run the Request and it's Contex
    *  through all of the screens.
  */
  async action(context: RequestContext, request: Request) {
    
    // Array of screens to populate
    let screens: Screen[];

    // Get details of current controller class and method
    let controllerClass = await this.getControllerClass();
    let methodName = await this.getMethodName();

    // Get screens for the current controller class
    const classScreensMetadata = getScreenClassMetadata(controllerClass);
    const classScreens = await ScreenActionProvider.getInstancesOfScreensFromMetadata(context, classScreensMetadata);

    // Get screens for the current controller method
    const methodScreensMetadata = getScreenMethodMetadata(controllerClass, methodName);
    const methodScreens = await ScreenActionProvider.getInstancesOfScreensFromMetadata(context, methodScreensMetadata);

    // We have class constructors of the desired screens at this point.
    // We do not have the instances that we need.
    // First we evaluate all the constructors and get instances
    screens = await Promise.all([].concat(classScreens, methodScreens));

    // Once we have instances of each of the screens we can run and await the executions
    return screens && Promise.all(screens.map(screen => screen && screen.screen(context, request)));
  }
}