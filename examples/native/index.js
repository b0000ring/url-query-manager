import UrlQueryManager from "url-query-manager";
import queryString from 'query-string';

class AppModule {
  manager = null;
  constructor(name) {
    this.manager = new UrlQueryManager(name, true);
    this.name = name;
    
    this.getInitialParamValues();
    this.renderInterface();
  }
  
 /*Custom method that gets params from url for the specific module*/
  getInitialParamValues() {
    const allParams = queryString.parse(location.search);
    const localParams = {};
    Object.entries(allParams).forEach(param => {
      const [paramName, paramValue] = param;
      if(paramName.includes(this.name)) {
        const processedName = this.removePrefix(paramName);
        localParams[processedName] = paramValue;
      }
    });
    
    /*Applying initial param values*/
    this.manager.push(localParams);
  }
  
  /*Helper that allows to remove module name from param key */
  removePrefix(value) {
    return value.split(`${this.name}_`).pop();
  }
  
  renderInterface() {
    const wrapper = document.createElement('div');
    wrapper.className = 'wrapper';
    
    const title = document.createElement('div');
    title.className = 'title';
    title.textContent = 'Module 1';
    
    const button = document.createElement('button');
    button.textContent = 'Add params';
    button.addEventListener('click', this.addParam.bind(this))
    
    wrapper.append(title, button);
    
    document.getElementById('root').append(wrapper);
  }
  
  /*Custom method that adds params on button click*/
  addParam() {
    const currentParams = this.manager.getQueryParams();
    const keyval = Object.keys(currentParams).length;
    
    this.manager.push({...currentParams, [keyval]: keyval});
    UrlQueryManager.applyQuery();
  }
}

function init() {
  new AppModule('module1')
  new AppModule('module2')
}

window.onload = init