/** @type {import('jest').Config} */
export default {
  displayName: 'frontend',
  // jsdom plus Node's fetch globals (Request, Response…), which React Router's navigation needs
  testEnvironment: 'jest-fixed-jsdom',
  testMatch: ['<rootDir>/src/**/*.test.{ts,tsx}'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  // React Router 8 is ESM-only, so run tests as native ESM
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  transform: {
    '^.+\\.(t|j)sx?$': [
      '@swc/jest',
      {
        jsc: {
          parser: { syntax: 'typescript', tsx: true },
          transform: { react: { runtime: 'automatic' } },
          target: 'es2023',
        },
        module: { type: 'es6' },
      },
    ],
  },
  // Vite handles asset imports; Jest needs stand-ins for them
  moduleNameMapper: {
    '\\.css$': 'identity-obj-proxy',
    '\\.(svg|png|jpe?g|gif|webp|avif)$': '<rootDir>/test/file-mock.cjs',
  },
};
