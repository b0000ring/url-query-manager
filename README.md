# URL-QUERY-MANAGER

An npm package that provides a safe and efficient solution for manipulating URL query parameters from different app modules separately.
Designed to prevent query parameter conflicts and ensure the integrity of your data. Allows to easily add, update, or remove query parameters without worrying about unexpected results or unintended consequences.

**url-query-manager** built with a focus on safety and security, making it a reliable choice for any project that requires URL query parameter manipulation. With its intuitive API, it is easy to use and can be integrated seamlessly into your existing codebase.

## Features:

- Safe manipulation of URL query parameters from different app modules
- Prevention of query parameter conflicts (automatically applied prefix)
- Efficient addition, update, or removal of query parameters
- Intuitive and easy-to-use API

## Installation
`npm install url-query-manager`

## Usage

The package exports `UrlQueryManager` class, which provides a general API for the package through static methods. 
When the object is instantiated, it provides an API for connection the application module and the parameters storage.

**Inside the module, there is a shared property that stores module data and parameters, so no additional initialization is needed in the app to start using the package.**

### Example

```js
import UrlQueryManager from 'url-query-manager';

// create a manager object for the module
const module = new UrlQueryManager('page');
// push some params
module.push({page_id: 'home'});
// apply params to URL...
UrlQueryManager.applyQuery();
// ...OR get the query to apply with any other way (some custom router for example)
UrlQueryManager.getQueryString();
```

`examples` folder contains some simple apps that uses this package
To see it in action go to the specific example folder, install deps with `npm i`, run the app `npm run start`

## API

### UrlQueryManager constructor params
| Name                | Type     | Description                                                                                                             |
|---------------------|----------|-------------------------------------------------------------------------------------------------------------------------|
| **name**            | `string` | Represents module name.                                                                                                 |
| **usePrefix**       | `boolean`| If true, the module name will be applied as a prefix to module parameters with an underscore (e.g., `name: page; params: id; -> page_id`). |

### UrlQueryManager instance properties

| Name          | Type     | Description                                                                                        |
|---------------|----------|----------------------------------------------------------------------------------------------------|
| **name**     | `string` | Module name.                                                                                       |
| **deleted**  | `boolean`| Returns true if the module was destroyed (by `.destroy()` method).                                 |

### UrlQueryManager static methods

| Name                      | Description                                                                                         |
|---------------------------|-----------------------------------------------------------------------------------------------------|
| **getAllQueryParams()**   | Returns all params from all modules (with applied prefix if module has it).                         |
| **getQueryString()**      | Returns query string with applied params from all modules (with applied prefix if module has it).   |
| **getModulesList()**      | Returns list of all modules names.                                                                 |
| **applyQuery()**          | Applies query string through `window.history.pushState`.                                            |

### UrlQueryManager instance methods

| Name                     | Description                                                                                      |
|--------------------------|--------------------------------------------------------------------------------------------------|
| **isParamAvailable(key)**| Checks for availability (no conflict with other modules params) of specific param by name. `key` - param key. |
| **push(params)**         | Pushes params to module params collection (overwrites all previous params in the module). `params` - object with query params where key is param name, and value is param value. |
| **getQueryParams()**     | Returns params applied to the module.                                                           |
| **destroy()**            | Destroying module (removing all the module params and prevents from future updates).             |

