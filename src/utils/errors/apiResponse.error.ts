import { Response } from "express";
import { StatusCodes } from 'http-status-codes';

export function buildApiErrorResponse(
    response: Response,
    statuscode: StatusCodes,
    error: Error
) {
    response
        .status(statuscode)
        .json({ error: { name: error.name, message: error.message } })
        .end();
}