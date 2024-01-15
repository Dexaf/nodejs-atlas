import jwt from 'jsonwebtoken';
import express from 'express';

import { envs } from '../config.js'
import { ErrorExt } from '../models/extensions/error.extension.js';
import { JwtData } from '../models/interfaces/jwtData.interface.js';
import { CustomRequest } from '../models/extensions/request.extension.js';

export const isAuthGuard = (req: CustomRequest, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.get('Authorization');

  if (!authHeader) {
    throw new ErrorExt('NO_AUTHORIZATION_TOKEN', 401);
  }

  const token = authHeader.split(' ')[1];
  let decodedToken: JwtData;

  try {
    decodedToken = jwt.verify(token, envs!.JWT_SECRET) as JwtData;
  } catch (err: any) {
    if (err.message === "jwt expired")
      throw new ErrorExt('JWT_EXPIRED', 500);
    else
      throw new ErrorExt('ERROR_DURING_AUTH_VERIFICATION', 500);
  }

  if (!decodedToken) {
    throw new ErrorExt('NOT_AUTHENTICATED', 401);
  }

  req.user = {
    id: decodedToken.userData.id
  }

  next();
}
