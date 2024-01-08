import express from 'express';
import bodyParser from 'body-parser';

import { envs } from './config.js'
import { connect } from './mongoose-starter.js';
import { ErrorExt } from './models/extensions/error.extension.js';
import authenticationRouter from './routes/authentication/authentication.routes.js'
import { logError } from './utils/logError.js';

try {
  if (envs) {
    const app = express();

    //connect to mongoose
    connect()
      .then(() => {
        //SECTION - MIDDLEWARES
        app.use(bodyParser.json());

        app.use((req, res, next) => {
          res.setHeader('Access-Control-Allow-Origin', envs!.ALLOWED_ORIGINS);
          res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT');
          res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
          next();
        })
        //!SECTION - MIDDLEWARES

        //SECTION - ROUTES
        app.use('/Auth', authenticationRouter);

        app.use((error: ErrorExt, req: express.Request, res: express.Response, next: express.NextFunction) => {
          logError(error);
          const status = error.statusCode || 500;
          res.status(status).json({ message: error.message, errors: error.errors ?? [] });
        })
        //!SECTION - ROUTES

        app.listen(envs.PORT);
        console.log(`Listening on port:${envs.PORT}`);
      });
  }
  else
    throw new Error("CONFIG NOT DEFINED")

} catch (error) {
  console.error("There was an error, check logs")
}


