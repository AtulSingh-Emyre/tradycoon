import * as jwt from 'jsonwebtoken';
import {Request, Response, NextFunction} from 'express';
import {getEnvironmentVariables} from '../environments/env';
export class AuthSetup {
  static isAuthenticated(req: Request, res: Response, next: NextFunction) {
    const bearerHeader = req.headers.authorization;
    if (typeof bearerHeader !== 'undefined') {
      const bearer = bearerHeader.split(' ');
      const bearerToken = bearer[1];
      jwt.verify(bearerToken, getEnvironmentVariables().jwt_secret, (err: any, authdata: any) => {
        if (err) {
          res.status(403).json({
            status: 'error',
            data: {},
            error: 'user not logged in',
            success: 'user logged in',
          });
        } else if (!authdata) {
          res.status(401).json({
            status: 'error',
          });
          next(new Error('User Not Authorised'));
        } else {
          req.user = authdata;
          next();
        }
      });
    } else {
      res.status(403).json({
        status: 'error',
        data: {},
        error: 'user not logged in',
        success: 'user logged in',
      });
    }
  }
}
