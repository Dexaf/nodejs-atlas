import ev from "express-validator";
import express from "express";
import { ErrorExt } from "../models/extensions/error.extension.js";

//TODO - far arrivare lo status code corretto
export const validationHandlingRoutine = (req: express.Request, res: express.Response) => {
  const errors = ev.validationResult(req);
  if (!errors.isEmpty())
    throw new ErrorExt("VALIDATION_ERROR", 422, errors);
}

export const errorHandlingRoutine = (error: any, next: express.NextFunction) => {
  let _error = error;
  if (!(_error instanceof ErrorExt))
    _error = new ErrorExt("UNKOWN_ERROR", 500, null);
  return next(error);
}