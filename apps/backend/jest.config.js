/** @type {import('jest').Config} */
export default {
  displayName: 'backend',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/src/**/*.spec.ts'],
  // Nest 12 and the Prisma client are ESM-only, so run tests as native ESM
  extensionsToTreatAsEsm: ['.ts'],
  transform: {
    '^.+\\.ts$': [
      '@swc/jest',
      {
        jsc: {
          parser: { syntax: 'typescript', decorators: true },
          transform: { legacyDecorator: true, decoratorMetadata: true },
          target: 'es2023',
        },
        module: { type: 'es6' },
      },
    ],
  },
  // Source uses ESM-style `./foo.js` imports; map them back to the .ts files
  moduleNameMapper: { '^(\\.{1,2}/.*)\\.js$': '$1' },
};
