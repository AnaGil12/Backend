"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
// Load test environment variables
dotenv_1.default.config({ path: '.env.test' });
// Set test environment
process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = 'mongodb://localhost:27017/algorithmic-challenges-test';
process.env.REDIS_URL = 'redis://localhost:6379/1';
process.env.JWT_SECRET = 'test-secret-key';
// Global test timeout
jest.setTimeout(30000);
// Basic test to ensure setup works
describe('Test Setup', () => {
    it('should load environment variables correctly', () => {
        expect(process.env.NODE_ENV).toBe('test');
        expect(process.env.JWT_SECRET).toBeDefined();
    });
});
//# sourceMappingURL=setup.js.map