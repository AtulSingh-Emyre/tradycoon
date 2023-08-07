import {ProdEnvironment} from './prod.env';
import {DevEnvironment} from './dev.env';

export interface IEnvironment {
  db_url: string;
  jwt_secret: string;
  phoneAuthapi: string;
  password: string;
  email: string;
  express_secret: string;
}

export function getEnvironmentVariables(): IEnvironment {
  if (process.env.NODE_ENV === 'production') {
    return ProdEnvironment;
  } else {
    return DevEnvironment;
  }
}
