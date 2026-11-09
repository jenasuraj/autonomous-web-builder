import '@testing-library/jest-dom';
import { TextDecoder, TextEncoder } from 'node:util';

// jsdom lacks these, and React Router needs them
Object.assign(globalThis, { TextEncoder, TextDecoder });
