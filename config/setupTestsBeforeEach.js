import fetch from 'jest-fetch-mock';

global.beforeEach(() => {
  jest.clearAllMocks();
  fetch.resetMocks();
});
