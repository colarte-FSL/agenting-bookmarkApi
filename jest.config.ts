import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFiles: ['./jest.setup.ts'],
  globals: {
    'ts-jest': {
      tsconfig: './tsconfig.test.json',
    },
  },
};

export default config;
