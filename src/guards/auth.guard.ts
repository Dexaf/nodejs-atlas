import jwt from 'jsonwebtoken';
import express from 'express';

import { envs } from '../config.js'
import { ErrorExt } from '../models/extensions/error.extension.js';

export const isAuthGuard = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.get('Authorization');

  if (!authHeader) {
    throw new ErrorExt('Not authenticated.', 401, null);
  }

  const token = authHeader.split(' ')[1];
  let decodedToken;

  try {
    decodedToken = jwt.verify(token, envs!.JWT_SECRET);
  } catch (err) {
    throw new ErrorExt('Error during verification', 500, null);
  }

  if (!decodedToken) {
    throw new ErrorExt('Not authenticated.', 401, null);
  }

  console.log(decodedToken);
  //req.userId = decodedToken.userId
  next();
}
