import { UrlQueryManager } from '../index';

describe('Initialization', () => {
  test('Init without prefix', () => {
    const name = 'test'
    const urlManager = new UrlQueryManager(name)
    const data = urlManager.getQueryParams()
    expect(data).toMatchObject({});
    expect(urlManager.name).toBe(name);
    expect(urlManager.usePrefix).toBe(false);
  });

  test('Init with prefix', () => {
    const name = 'test'
    const urlManager = new UrlQueryManager(name, true)
    expect(urlManager.usePrefix).toBe(true);
  });

  describe('Getters', () => {
    test('getQueryParams for one existing module', () => {
      const moduleName = 'module1';
      const module1 = new UrlQueryManager(moduleName);
      const param = {user: 'Alex'};

      module1.push(param);

      const data = module1.getQueryParams();
      expect(data).toMatchObject(param);
    });

    test('getQueryParams for certain module', () => {
      const moduleName = 'module1';
      const module2Name = 'module2';

      const module1 = new UrlQueryManager(moduleName);
      const module2 = new UrlQueryManager(module2Name);
      const param = {user: 'Alex'};

      module1.push(param);

      const data = module1.getQueryParams();
      expect(data).toMatchObject(param);

      const data2 = module2.getQueryParams();
      expect(data2).toMatchObject({});
    })


  })
})
