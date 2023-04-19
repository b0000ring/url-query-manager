import { UrlQueryManager } from '../index';

describe('Static methods', () => {
  test('getAllQueryParams', () => {
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
  });
  
  test('getQueryString', () => {
    const module = new UrlQueryManager('test');
    module.push({id:1, name: 'alex'});
    const queryString = UrlQueryManager.getQueryString();
    
    expect(queryString).toBe('id=1&name=alex')
  }); 
})
