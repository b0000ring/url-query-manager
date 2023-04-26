import queryString from 'query-string';

import { Dictionary, Module, Value } from "./types";

const modules: Dictionary<Module> = {};

/*
  A class for manipulating URL parameters from different modules
*/
export class UrlQueryManager {
  _name = '';

  /*
    Returns all params from all modules (with applied prefix if module has it)
  */
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

  /*
    Returns query string with applied params from all modules (with applied prefix if module has it)
  */
  static getQueryString() {
    const params = this.getAllQueryParams();
    return queryString.stringify(params);
  }

  /*
    Returns list of all modules names
  */
  static getModulesList() {
    return Object.keys(modules);
  }

  /*
    Applies query string through window.history.pushState
  */
  static applyQuery() {
    const queryString = this.getQueryString();
    const newUrl = `${window.location.protocol}//${window.location.host}${window.location.pathname}?${queryString}`;
    window.history.pushState({path:newUrl}, '', newUrl);
  }

  /*
    Creates an object that represents a module which wants to manipulate URL query params
    @param name module name
    @param usePrefix if true applies module name as prefix to all the params
  */
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

  /*
    Checks for availability of specific param by name
    @param key param name to check
  */
  @checkAvailability
  isParamAvailable(key: string): Boolean {
    let found = false;
    Object.entries(modules).forEach(module => {
      const [name, data] = module;

      if(name !== this.name && !data.prefix && Object.keys(data.params).find(name => name === key)) {
        found = true;
      }
    })

    return !found;
  }

  /*
    Pushes params to module params collection (overwrites all previous params in the module)
    @param params object with params where key is param name, and value is param value
  */
  @checkAvailability
  push(params: Dictionary<Value>) {
    let finalParams: Dictionary<Value> = {};

    if(modules[this.name].prefix) {
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

  /*
    Returns params applied to the module
  */
  @checkAvailability
  getQueryParams() {
    return {...modules[this.name].params};
  }

  /*
    Destroying module (removing all the params and prevents from future updates)
  */
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