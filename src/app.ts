import express from 'express';

import { envs } from './config.js'
import { connect } from './mongoose-starter.js';
import authenticationRouter from './routes/authentication/authentication.routes.js'
import bodyParserMiddleware from './middlewares/body-parser.middleware.js';
import headersMiddleware from './middlewares/headers.middleware.js';
import errorMiddleware from './middlewares/error.middleware.js';
import crashHandlingRoutine from './utils/crashHandlingRoutine.js';

const main = async () => {
  try {
    if (envs) {
      const app = express();

      //connect to mongoose
      await connect()

      //SECTION - MIDDLEWARES
      app.use(bodyParserMiddleware);
      app.use(headersMiddleware);
      //!SECTION - MIDDLEWARES

      //SECTION - ROUTES
      app.use('/Auth', authenticationRouter);
      //!SECTION - ROUTES

      //NOTE - error middleware need to be here to catch errors from the route
      app.use(errorMiddleware);

      app.listen(envs.PORT);
      console.log(`Listening on port:${envs.PORT}`);
    }
    else
      throw new Error("CONFIG NOT DEFINED")

  } catch (error) {
    crashHandlingRoutine(error);
  }
}

await main();