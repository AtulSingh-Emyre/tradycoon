import express from 'express';
import cors from 'cors';
import {Response} from 'express';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import mongoose from 'mongoose';
import WebSocket from 'ws';

//server file imports

import AuthRouter from './routers/AuthRoutes';
import UserRouter from './routers/UserRouter';
import {getEnvironmentVariables} from './environments/env';
import AnalystPostRouter from './routers/AnalystPostRouter';
import ClientGroupCRUDrouter from './routers/ClientGroupCRUDrouter';
import http from 'http';
import {GlobalAppListener} from './middlewares/GlobalAppListener';
import ChatRouter from './routers/ChatRouter';
import UserNotificationRouter from './routers/UserNotificationRouter';
import {Jobs} from './jobs/Jobs';
export class Server {
  public app: express.Application = express();
  public http = new http.Server(this.app);
  constructor() {
    this.setConfigurations();
    this.setRoutes();
    this.error404Handler();
    this.handleErrors();
  }

  setConfigurations() {
    this.app.use(cookieParser());
    this.app.use(
      cors({
        origin: '*',
      }),
    );
    void this.connectMongoDb();
    this.configureBodyParser();
    this.configureExpressSession();
    Jobs.runRequiredJobs();
  }

  configureExpressSession() {
    this.app.use(
      session({
        secret: getEnvironmentVariables().express_secret,
        resave: true,
        saveUninitialized: false,
      }),
    );
    console.log('Express session configured');
  }

  configureBodyParser() {
    this.app.use(express.urlencoded({extended: true}));
    this.app.use(express.json());
    console.log('body-parser setup');
  }

  setRoutes() {
    this.app.use('/api/auth', AuthRouter);
    this.app.use('/user-management', UserRouter);
    this.app.use('/analyst', AnalystPostRouter);
    this.app.use('/client-group-management', ClientGroupCRUDrouter);
    this.app.use('/global-chat', ChatRouter);
    this.app.use('/user-notif', UserNotificationRouter);
  }

  connectMongoDb() {
    const databaseUrl = getEnvironmentVariables().db_url;
    mongoose
      .connect(databaseUrl, {useNewUrlParser: true, useUnifiedTopology: true})
      .then(() => {
        console.log('connection successfully made with database');
      })
      .catch((error) => this.handleErrors());
  }

  error404Handler() {
    this.app.use((req, res) => {
      res.status(404).json({
        message: 'Not Found',
        status_code: 404,
      });
    });
  }

  handleErrors() {
    this.app.use((error: any, req: any, res: Response) => {
      const errorStatus = req.errorStatus || 500;
      res.json({
        message: error.message || 'Something Went Wrong. Please Try Again',
        status_code: errorStatus,
        success: false,
      });
    });
  }
}
