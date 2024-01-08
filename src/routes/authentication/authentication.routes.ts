import express from "express";
import * as authenticationController from "../../controllers/authentication.controller.js";
import * as authenticationValidationChains from "../../validation-chains/authentication.validation-chains.js";
import { isAuthGuard } from "../../guards/auth.guard.js";

const authenticationRouter = express.Router();

authenticationRouter.get('/User', isAuthGuard, authenticationController.getUser)
authenticationRouter.post('/SignOn', authenticationValidationChains.singOn, authenticationController.signOn)
authenticationRouter.post('/LogIn', authenticationValidationChains.logIn, authenticationController.logIn)

export default authenticationRouter;