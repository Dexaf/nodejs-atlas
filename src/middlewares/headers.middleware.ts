import express from "express";
import { envs } from "../config.js";

export default (req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.setHeader('Access-Control-Allow-Origin', envs!.ALLOWED_ORIGINS);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
}