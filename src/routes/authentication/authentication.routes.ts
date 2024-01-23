import express from "express";
import * as authenticationController from "../../controllers/authentication.controller.js";
import * as authenticationValidationChains from "../../validation-chains/authentication.validation-chains.js";
import { isAuthGuard } from "../../guards/auth.guard.js";

const authenticationRouter = express.Router();

authenticationRouter.get('/user', isAuthGuard, authenticationController.getUser)
authenticationRouter.post('/signOn', authenticationValidationChains.singOn, authenticationController.signOn)
authenticationRouter.post('/logIn', authenticationValidationChains.logIn, authenticationController.logIn)

export default authenticationRouter;