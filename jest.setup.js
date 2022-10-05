import '@testing-library/jest-dom/extend-expect';
import { expect } from '@jest/globals';

const toHaveLoader = (obj) => {
  if (obj.queryByRole('progressbar')) {
    return {
      message: () => 'Must have loader with role "progressbar"',
      pass: true
    };
  } else {
    return {
      message: () => 'Must have loader with role "progressbar"',
      pass: false
    };
  }
};

expect.extend({
  toHaveLoader
});
