import {UrlQueryManager} from '../index';

describe('Constructor', () => {
  test('should init without prefix usage', () => {
    const name = 'test'
    const urlManager = new UrlQueryManager(name);
    const data = urlManager.getQueryParams();
    expect(data).toEqual({});
    expect(urlManager.name).toBe(name);

    urlManager.destroy();
  });

  test('should init with prefix', () => {
    const name = 'test';
    const urlManager = new UrlQueryManager(name, true);
    urlManager.push({id: 1});
    const data = UrlQueryManager.getAllQueryParams();
    expect(data).toEqual({[name + '_id']: 1});

    urlManager.destroy();
  });
})

describe('getQueryParams', () => {
  test('should return params for specific module', () => {
    const moduleName = 'module1';
    const module2Name = 'module2';

    const module1 = new UrlQueryManager(moduleName);
    const module2 = new UrlQueryManager(module2Name);
    const param = {user: 'Alex'};

    module1.push(param);

    const data = module1.getQueryParams();
    expect(data).toEqual(param);

    const data2 = module2.getQueryParams();
    expect(data2).toEqual({});

    module1.destroy();
    module2.destroy();
  });

  test('should do nothing if module is destroyed', () => {
    const module = new UrlQueryManager('module');
    module.destroy();
    const data = module.getQueryParams();
    expect(data).toBe(undefined);
  });
})

describe('isParamAvailable', () => {
  test('should return true if there is no such param in other module', () => {
    const module1 = new UrlQueryManager('test');
    const module2 = new UrlQueryManager('test2');

    module1.push({id: 1});

    const result = module2.isParamAvailable('name');
    expect(result).toBe(true);
  });

  test('should return false if there is such param in other module', () => {
    const module1 = new UrlQueryManager('test');
    const module2 = new UrlQueryManager('test2');

    module1.push({id: 1});

    const result = module2.isParamAvailable('id');
    expect(result).toBe(false);

    module1.destroy();
    module2.destroy();
  });

  test('should do nothing if module is destroyed', () => {
    const module = new UrlQueryManager('module');
    module.destroy();
    const data = module.isParamAvailable('id');
    expect(data).toBe(undefined);
  });
});

describe('push', () => {
  test('should push params to module', () => {
    const params = {id: 1, name: 'alex'};
    const module = new UrlQueryManager('module');
    module.push(params);
    const data = module.getQueryParams();

    expect(data).toEqual(params);
    module.destroy();
  });

  test('without prefix should ignore params that already exists in other module', () => {
    const params = {id: 1, name: 'alex'};
    const module = new UrlQueryManager('module');
    const module2 = new UrlQueryManager('module2');
    module2.push({id: 1})
    module.push(params);
    const data = module.getQueryParams();

    expect(data).toEqual({name: 'alex'});
    module.destroy();
    module2.destroy();
  });

  test('with prefix should add params that already exists in other module', () => {
    const params = {id: 1, name: 'alex'};
    const module = new UrlQueryManager('module', true);
    const module2 = new UrlQueryManager('module2');
    module2.push({id: 1})
    module.push(params);
    const data = module.getQueryParams();

    expect(data).toEqual(params);
    module.destroy();
    module2.destroy();
  });

  test('should do nothing if module is destroyed', () => {
    const module = new UrlQueryManager('module');
    module.destroy();
    module.push({id: 1});
    const data = UrlQueryManager.getAllQueryParams()
    expect(data).toEqual({});
  });
})

describe('getQueryParams', () => {
  test('should return params added to this module', () => {
    const params = {id: 1, name: 'alex'};
    const module = new UrlQueryManager('module');
    module.push(params);
    const data = module.getQueryParams();
    expect(data).toEqual(params)
  });

  test('should do nothing if module is destroyed', () => {
    const module = new UrlQueryManager('module');
    module.destroy();
    module.push({id: 1});
    const data = module.getQueryParams()
    expect(data).toBe(undefined);
  });
})

describe('Destroy', () => {
  test('destroy module', () => {
    const moduleName = 'module1';
    const module2Name = 'module2';

    const module1 = new UrlQueryManager(moduleName);
    const module2 = new UrlQueryManager(module2Name);
    const param = {user: 'Alex'};

    module1.push(param);
    module1.destroy();

    const data = UrlQueryManager.getAllQueryParams();

    expect(data).not.toEqual(param);

    const modules = UrlQueryManager.getModulesList();

    expect(modules).toContain(module2Name);
    expect(modules).not.toContain(moduleName);
    expect(module1.deleted).toBe(true);

    module2.destroy();
  })
})
