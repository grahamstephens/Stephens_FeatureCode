import { Get } from '@decorators/express';
import { Controller, Delete, Post, Put } from '@decorators/express/lib/src';
import { Request, Response } from 'express';
import DataModel from '../models/data.model';

/**
 * Example router containing all the endpoints at a given URL.
 * TODO: Remove once proper endpoints are established.
 */
@Controller('/test')
export class TestController {
    // call `curl localhost:8080/test` or simply put URL in broswer.
    // decorators to define get path
    @Get('/')
    public testGet(
        req: Request,
        res: Response
    ): Response<any, Record<string, any>> {
        return res.json({
            message: 'This is a test GET payload',
        } as DataModel);
    }

    // call `curl -X POST localhost:8080/test`
    // decorators to define post path
    @Post('/')
    public testPost(
        req: Request,
        res: Response
    ): Response<any, Record<string, any>> {
        return res.json({
            message: 'This is a test POST payload',
        } as DataModel);
    }

    // call `curl -X PUT localhost:8080/test`
    // decorators to define put path
    @Put('/')
    public testPut(
        req: Request,
        res: Response
    ): Response<any, Record<string, any>> {
        return res.json({
            message: 'This is a test PUT payload',
        } as DataModel);
    }

    // call `curl -X DELETE localhost:8080/test`
    // decorators to define delete path
    @Delete('/')
    public testDelete(
        req: Request,
        res: Response
    ): Response<any, Record<string, any>> {
        return res.json({
            message: 'This is a test DELETE payload',
        } as DataModel);
    }
}
