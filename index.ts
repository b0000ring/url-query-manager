import queryString from 'query-string';

import { Dictionary, Module, Value } from "./types";

const modules: Dictionary<Module> = {};

export class UrlQueryManager {
  _name = '';

//  Get params for all modules
  static getAllQueryParams(): Dictionary<Value> {
    let params: Dictionary<Value> = {};
    Object.values(modules).forEach(item => {
      Object.entries(item.params).forEach(param => {
        let [key, value] = param;
        if(item.prefix) {
          key = `${item.prefix}_${key}`
        }
        params[key] = value
      })
    });

    return params;
  }

//  Get complete query string with params from all modules
  static getQueryString() {
    const params = this.getAllQueryParams();
    return queryString.stringify(params);
  }

  static getModulesList() {
    return Object.keys(modules);
  }

  //  Apply module query params string to URL
  static applyQuery() {
    const queryString = this.getQueryString();
    const newUrl = `${window.location.protocol}//${window.location.host}${window.location.pathname}?${queryString}`;
    window.history.pushState({path:newUrl}, '', newUrl);
  }

  constructor(name: string, usePrefix: boolean = false) {
    this._name = name;
    if(!modules[name]) {
      modules[name] = {
        prefix: usePrefix ? name : '',
        params: {}
      };
    }
  }

  get name() {
    return this._name;
  }

  get deleted() {
    return !modules[this.name];
  }

  @checkAvailability
  isParamAvailable(key: string): Boolean {
    const allParams = UrlQueryManager.getAllQueryParams();
    const moduleParams = modules[this.name].params;

    const allParamsKeys = Object.keys(allParams);
    const moduleKeys = Object.keys(moduleParams);

    return !(!moduleKeys.includes(key) && allParamsKeys.includes(key));
  }

//  Push params set to module
  @checkAvailability
  push(params: Dictionary<Value>, force: boolean = false) {
    let finalParams: Dictionary<Value> = {};

    if(force || modules[this.name].prefix) {
      finalParams = params;
    } else {
//    ignore params that exists in other modules
      Object.keys(params)
        .filter(key => this.isParamAvailable(key))
        .forEach(key => finalParams[key] = params[key])
    }

    modules[this.name].params = {
      ...finalParams
    };
  }

//  Get current params for module
  @checkAvailability
  getQueryParams() {
    return {...modules[this.name].params};
  }

//  Get module params parsed from query if module uses prefix
  parse() {

  }

//  Unsubscribe modules
  destroy() {
    delete modules[this.name];
  }
}

//TODO set proper descriptor type
function checkAvailability(target: UrlQueryManager, propertyKey: keyof UrlQueryManager, descriptor: Dictionary<any>) {
  const originalMethod = descriptor.value;

  descriptor.value = function(...args: any[]) {
    if (this.deleted) {
      return undefined;
    } else {
      return originalMethod.apply(this, args);
    }
  };

  return descriptor;
}

export default UrlQueryManager