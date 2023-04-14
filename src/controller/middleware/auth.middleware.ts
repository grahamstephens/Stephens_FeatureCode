import { Middleware } from '@decorators/express';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import { ExtractJwt, Strategy, VerifiedCallback } from 'passport-jwt';
import { buildApiErrorResponse } from './../../utils/errors/apiResponse.error';
import { StatusCodes } from 'http-status-codes/build/cjs/status-codes';
import { UserService } from './../../service/user.service';

export class AuthMiddleware implements Middleware {
    constructor() {
        const strategyConfig = {
            secretOrKey: process.env.AUTH_SECRET,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        };
        passport.use('jwt', new Strategy(strategyConfig, this.validateToken));
    }

    public use(request: Request, response: Response, next: any): void {
        passport.authenticate(
            'jwt',
            { session: false },
            (error, user, info) => {
                if (error || !user) {
                    return buildApiErrorResponse(
                        response,
                        StatusCodes.UNAUTHORIZED,
                        new Error('Authentication failed')
                    );
                }
                // Only continue to next middleware or to endpoint if no error has occured
                next();
            }
        )(request, response, next);
    }

    private validateToken(jwtPaylod: any, done: VerifiedCallback) {
        // Get a local instance of the user service
        const userService = new UserService();
        return userService
            .findByEmail(jwtPaylod.email)
            .then((foundUser) => {
                // Validate response from database
                if (!foundUser) {
                    return done(new Error('Invalid credentials'));
                }

                return done(null, foundUser, {
                    message: 'Authorized successfully',
                });
            })
            .catch((error) => done(error));
    }
}
