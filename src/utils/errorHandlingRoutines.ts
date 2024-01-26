import ev from "express-validator";
import express from "express";
import { ErrorExt } from "../models/extensions/error.extension.js";

export const validationHandlingRoutine = (req: express.Request, res: express.Response) => {
  const errors = ev.validationResult(req).array({ onlyFirstError: true });
  if (errors.length !== 0)
    throw new ErrorExt("VALIDATION_ERROR", 400, errors);
}

export const errorHandlingRoutine = (error: any, next: express.NextFunction) => {
  let _error = error;
  if (!(_error instanceof ErrorExt))
    _error = new ErrorExt("UNKOWN_ERROR", 500);
  return next(_error);
}