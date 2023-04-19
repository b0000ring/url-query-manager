import queryString from 'query-string';

import { Dictionary, Value } from "./types";

const modules: Dictionary<Dictionary<Value>> = {};

export class UrlQueryManager {
  name = '';
  usePrefix = false;
  deleted = false;

//  Get params for all modules
  static getAllQueryParams(): Dictionary<string> {
    let params = {};
    Object.values(modules).forEach(item => {
      params = {
        ...params,
        ...item
      };
    });

    return params;
  }

//  Get complete query string with params from all modules
  static getQueryString() {
    const params = this.getAllQueryParams()
    return queryString.stringify(params)
  }

//  Apply all params query string to URL
  static applyAll() {

  }

  static getModules(){
    return Object.keys(modules);
  }

  constructor(name: string, usePrefix: boolean = false) {
    this.name = name;
    this.usePrefix = usePrefix;
    if(!modules[name]) {
      modules[name] = {};
    }
  }

//  Apply module query params string to URL
  apply() {

  }

//  Push params set to module
  push(params: Dictionary<Value>) {
    modules[this.name] = {...params}
  }

//  Get current params for module
  getQueryParams() {
    return modules[this.name]
  }

//  Unsubscribe modules
  destroy() {
    this.deleted = true;
    delete modules[this.name];
  }
}

export default UrlQueryManager