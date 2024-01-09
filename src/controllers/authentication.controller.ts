import express from "express";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

import { LogInDto, SignOnDto } from "../models/dto/authentication.dto.js";
import { UserModel } from "../models/schemas/user.schema.js";
import { ErrorExt } from "../models/extensions/error.extension.js";
import { envs } from "../config.js";
import { errorHandlingRoutine, validationHandlingRoutine } from "../utils/errorHandlingRoutines.js";
import UserInterface from "../models/interfaces/user.interface.js";
import { CustomRequest } from "../models/extensions/request.extension.js";

export const signOn = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    validationHandlingRoutine(req, res);

    const body = req.body as SignOnDto;

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

    const body = req.body as LogInDto;

    const user = await UserModel.findOne({ username: body.username });
    if (!user)
      throw new ErrorExt("NO_USERNAME_FOUND_IN_LOGIN", 404, null);

    const isPasswordMatching = await bcrypt.compare(body.password, user.password);

    if (!isPasswordMatching)
      throw new ErrorExt("WRONG_PASSWORD", 403, null);

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
  const userData: UserInterface = {
    username: user.username
  }
  res.send(userData);
}