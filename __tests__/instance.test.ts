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
})
