import { UrlQueryManager } from '../index';
test('Test test', () => {
  expect(new UrlQueryManager().test()).toBe('hello world');
});