import express from "express";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

import { LogInDtoReq, SignOnDtoReq } from "../models/dto/req/authentication.dto.req.js";
import { UserModel } from "../models/schemas/user.schema.js";
import { ErrorExt } from "../models/extensions/error.extension.js";
import { envs } from "../config.js";
import { errorHandlingRoutine, validationHandlingRoutine } from "../utils/errorHandlingRoutines.js";
import UserDtoRes from "../models/dto/res/user.dto.res.js";
import { CustomRequest } from "../models/extensions/request.extension.js";

export const signOn = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    validationHandlingRoutine(req, res);

    const body = req.body as SignOnDtoReq;

    const hashedPass = await bcrypt.hash(body.password, parseInt(envs!.PASSWORD_SALT));
    const newUser = new UserModel({
      _id: new mongoose.Types.ObjectId(),
      username: body.username,
      password: hashedPass
    });
    await newUser.save();

    const userData = {
      id: newUser._id,
      username: newUser.username
    };
    res.send(userData).status(200);
  } catch (error: any) {
    return errorHandlingRoutine(error, next);
  }
}

export const logIn = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    validationHandlingRoutine(req, res);

    const body = req.body as LogInDtoReq;

    const user = await UserModel.findOne({ username: body.username });
    if (!user)
      throw new ErrorExt("USER_NO_MATCH", 404);

    const isPasswordMatching = await bcrypt.compare(body.password, user.password);

    if (!isPasswordMatching)
      throw new ErrorExt("WRONG_PASSWORD", 403);

    const userData = {
      id: user._id,
      username: user.username
    };

    const token = jwt.sign({ userData }, envs!.JWT_SECRET, { expiresIn: envs!.JWT_EXPIRATIONS })

    res.send(token).status(200)
  } catch (error: any) {
    return errorHandlingRoutine(error, next);
  }
}

export const getUser = async (req: CustomRequest, res: express.Response, next: express.NextFunction) => {
  const user = await UserModel.findById(req.user.id)
  if (!user)
    throw new ErrorExt("USER_NO_MATCH", 404);

  const userData: UserDtoRes = {
    username: user.username
  }
  res.send(userData);
}