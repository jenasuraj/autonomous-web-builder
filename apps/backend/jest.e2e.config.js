import base from './jest.config.js';

/** @type {import('jest').Config} */
export default {
  ...base,
  displayName: 'backend-e2e',
  testMatch: ['<rootDir>/test/**/*.e2e-spec.ts'],
};
