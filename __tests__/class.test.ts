import { UrlQueryManager } from '../index';
import { jest } from '@jest/globals';

Object.defineProperty(global, 'window', {
  value: {}
})

Object.defineProperty(window, 'location', {
  value: {
    ancestorOrigins: {} as DOMStringList,
    hash: '',
    host: 'dummy.com',
    port: '80',
    protocol: 'http:',
    hostname: 'dummy.com',
    href: 'http://dummy.com?page=1&name=testing',
    origin: 'http://dummy.com',
    pathname: '',
    search: '',
    assign: () => {},
    reload: () => {},
    replace: () => {},
  }
})

Object.defineProperty(window, 'history', {
  value: {
    pushState: jest.fn(),
    replaceState: jest.fn(),
    go: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
  }
});

describe('Static methods', () => {
  describe('getAllQueryParams', () => {
    test('should return params without prefix', () => {
      const name1 = 'test1';
      const name2 = 'test2';
      const module1 = new UrlQueryManager(name1);
      const module2 = new UrlQueryManager(name2);
      const param1 = {id: 1};
      const param2 = {name: 'alex'};

      module1.push(param1);
      module2.push(param2);

      const data = UrlQueryManager.getAllQueryParams();

      expect(data).toMatchObject({
        ...param1,
        ...param2
      });

      module1.destroy();
      module2.destroy();
    });

    test('should return params with prefix', () => {
      const name1 = 'test1';
      const name2 = 'test2';
      const module1 = new UrlQueryManager(name1, true);
      const module2 = new UrlQueryManager(name2);
      const param1 = {id: 1};
      const param2 = {id: 2};

      module1.push(param1);
      module2.push(param2);

      const data = UrlQueryManager.getAllQueryParams();

      expect(data).toMatchObject({
        ...{[name1 + '_id']: 1},
        ...param2
      });

      module1.destroy();
      module2.destroy();
    });
  })

  describe('getQueryString', () => {
    test('should return string with applied queries', () => {
      const module = new UrlQueryManager('test');
      const module2 = new UrlQueryManager('test2', true)

      module.push({id:1, name: 'alex'});
      module2.push({isAdmin: 'true'});

      const queryString = UrlQueryManager.getQueryString();

      expect(queryString).toBe('id=1&name=alex&test2_isAdmin=true')

      module.destroy();
      module2.destroy();
    });
  })

  describe('getModulesList', () => {
    test('should return list of connected modules', () => {
      const name1 = 'test';
      const name2 = 'test2';
      const module = new UrlQueryManager(name1);
      const module2 = new UrlQueryManager(name2);
      const list = UrlQueryManager.getModulesList();

      expect(list).toMatchObject([name1, name2]);

      module.destroy();
      module2.destroy();
    });
  })

  describe('applyQuery', () => {
    test('should apply query params to url', () => {
      const module = new UrlQueryManager('test');
      const module2 = new UrlQueryManager('test2');
      const newUrl = 'http://dummy.com?id=1&name=alex';
      module.push({id: 1});
      module2.push({name: 'alex'});

      UrlQueryManager.applyQuery();

      expect(window.history.pushState).toBeCalledWith({path: newUrl}, '', newUrl);

      module.destroy();
      module2.destroy();
    });
  })
})
