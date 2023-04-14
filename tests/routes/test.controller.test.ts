import { attachControllers } from '@decorators/express';
import { Express } from 'express';
import request from 'supertest';
import { TestController } from './../../src/controller/test.controller';
import { expressServerInit } from './../../src/utils/server.utils';

/**
 * Example integration routing testing
 */
describe('TestController', () => {
    const controllerPath = '/test';

    const testContext: Express = expressServerInit((app) => {
        attachControllers(app, [TestController]);
    });

    it('should configure', () => {
        expect(testContext).toBeTruthy();
    });

    describe('GET route', () => {
        it('should return a 200', async () => {
            const response = await request(testContext).get(controllerPath);
            expect(response.statusCode).toEqual(200);
            expect(response.body.message).toEqual('This is a test GET payload');
        });
    });

    describe('POST route', () => {
        it('should return a 200', async () => {
            const response = await request(testContext).post(controllerPath);
            expect(response.statusCode).toEqual(200);
            expect(response.body.message).toEqual(
                'This is a test POST payload'
            );
        });
    });

    describe('PUT route', () => {
        it('should return a 200', async () => {
            const response = await request(testContext).put(controllerPath);
            expect(response.statusCode).toEqual(200);
            expect(response.body.message).toEqual('This is a test PUT payload');
        });
    });

    describe('DELETE route', () => {
        it('should return a 200', async () => {
            const response = await request(testContext).delete(controllerPath);
            expect(response.statusCode).toEqual(200);
            expect(response.body.message).toEqual(
                'This is a test DELETE payload'
            );
        });
    });
});
