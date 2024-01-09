import express from "express";
import { ErrorExt } from "../models/extensions/error.extension.js";
import { logError } from "../utils/logError.js";


export default (error: ErrorExt, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logError(error);
  const status = error.statusCode || 500;
  res.status(status).json({ message: error.message, errors: error.errors ?? [] });
}