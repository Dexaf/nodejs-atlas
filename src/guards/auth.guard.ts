import jwt from 'jsonwebtoken';
import express from 'express';

import { envs } from '../config.js'
import { ErrorExt } from '../models/extensions/error.extension.js';
import { JwtData } from '../models/interfaces/jwtData.interface.js';

export const isAuthGuard = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.get('Authorization');

  if (!authHeader) {
    throw new ErrorExt('Not authenticated.', 401, null);
  }

  const token = authHeader.split(' ')[1];
  let decodedToken: JwtData;

  try {
    decodedToken = jwt.verify(token, envs!.JWT_SECRET) as JwtData;
  } catch (err) {
    if (err.message === "jwt expired")
      throw new ErrorExt('JWT_EXPIRED', 500, null);
    else
      throw new ErrorExt('Error during verification', 500, null);
  }

  if (!decodedToken) {
    throw new ErrorExt('Not authenticated.', 401, null);
  }

  //req.userId = decodedToken.userData.id
  next();
}
