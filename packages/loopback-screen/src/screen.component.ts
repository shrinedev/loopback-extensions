// Copyright Shrine Development. 2017,2018. All Rights Reserved.
// Node module: @shrinedev/loopback-screen
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {Component, ProviderMap, ClassMap, createBindingFromClass, Binding} from '@loopback/core';
import { ScreenBindings } from './keys';
import { ScreenActionProvider } from './providers/screen-action.provider';
import { Class } from '@loopback/repository';
import { Screen } from './types';
import { RequestContext, Request } from '@loopback/rest';


export class ScreenComponent implements Component {
  providers?: ProviderMap;
  classes?: ClassMap;
  bindings?: Binding[];
  
  constructor(...screens: Class<Screen>[]) {
    this.providers = {
      [ScreenBindings.SCREEN_ACTION_PROVIDER.key]: ScreenActionProvider
    };
    
     this.bindings = screens.map(s => createBindingFromClass(s));
  }
}

