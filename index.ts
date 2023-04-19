import queryString from 'query-string';

import { Dictionary, Module, Value } from "./types";

const modules: Dictionary<Module> = {};

export class UrlQueryManager {
  name = '';
  deleted = false;

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
    this.name = name;
    if(!modules[name]) {
      modules[name] = {
        prefix: usePrefix ? name : '',
        params: {}
      };
    }
  }

//  Push params set to module
  push(params: Dictionary<Value>) {
    modules[this.name].params = {
      ...params
    };
  }

//  Get current params for module
  getQueryParams() {
    return {...modules[this.name].params}
  }

//  Unsubscribe modules
  destroy() {
    this.deleted = true;
    delete modules[this.name];
  }
}

export default UrlQueryManager