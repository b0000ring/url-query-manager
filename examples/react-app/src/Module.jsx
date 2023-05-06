import { useRef, useEffect } from 'react';
import UrlQueryManager from 'url-query-manager';
import queryString from 'query-string';


/*Helper that allows to remove module name from param key */
function removePrefix(name, value) {
  return value.split(`${name}_`).pop();
}

export function Module({ name }) {
  /*Putting url-query-manager instance into ref to prevent instance recreation on every render*/
  const manager = useRef(new UrlQueryManager(name, true));
  
  /*Custom getting inital params values*/
  useEffect(() => {
    const allParams = queryString.parse(window.location.search);
    const localParams = {};
    Object.entries(allParams).forEach(param => {
      const [paramName, paramValue] = param;
      if(paramName.includes(name)) {
        const processedName = removePrefix(name, paramName);
        localParams[processedName] = paramValue;
      }
    });
    
    /*Applying initial param values*/
    manager.current.push(localParams);
  }, [name]);

  /*Custom method that adds params on button click*/
  function addParam() {
    const currentParams = manager.current.getQueryParams();
    const keyval = Object.keys(currentParams).length;

    manager.current.push({...currentParams, [keyval]: keyval});
    UrlQueryManager.applyQuery();
  }
  
  return (
    <div className="wrapper">
      <div className="title">
        {name}
      </div>
      <button onClick={addParam}>
        Add params
      </button>
    </div>
  );
}
