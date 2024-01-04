import express from "express";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

import { LogIn, SignOn } from "../models/dto/authentication.dto.js";
import { UserModel } from "../models/schemas/user.schema.js";
import { ErrorExt } from "../models/extensions/error.extension.js";
import { envs } from "../config.js";
import { errorHandlingRoutine, validationHandlingRoutine } from "../utils/errorHandlingRoutine.js";


export const signOn = async (req: express.Request<{}, {}, SignOn>, res: express.Response, next: express.NextFunction) => {
  try {
    validationHandlingRoutine(req, res);
    const hashedPass = await bcrypt.hash(req.body.password, parseInt(envs!.PASSWORD_SALT));
    const newUser = new UserModel({
      _id: new mongoose.Types.ObjectId(),
      username: req.body.username,
      password: hashedPass
    });
    await newUser.save();
    res.send(newUser).status(200);
  } catch (error: any) {
    return errorHandlingRoutine(error, next);
  }
}
 
export const logIn = async (req: express.Request<{}, {}, LogIn>, res: express.Response, next: express.NextFunction) => {
  try {
    validationHandlingRoutine(req, res);
    const user = await UserModel.findOne({ username: req.body.password });
    if (!user)
      throw new ErrorExt("NO_USERNAME_FOUND_IN_LOGIN", 404, null);

    const isPasswordMatching = await bcrypt.compare(req.body.password, user.password);

    if (!isPasswordMatching)
      throw new ErrorExt("WRONG_PASSWORD", 403, null);

    const token = jwt.sign({ user }, envs!.JWT_SECRET, { expiresIn: "24h" })

    res.send(token).status(200)
  } catch (error: any) {
    return errorHandlingRoutine(error, next);
  }
}

export const getUsers = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.send(Array.from(await UserModel.find()))
}