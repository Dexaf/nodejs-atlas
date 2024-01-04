import express from "express";
import * as authenticationController from "../../controllers/authentication.controller.js";
import * as authenticationValidationChains from "./authentication.validation-chains.js";

const authenticationRouter = express.Router();

authenticationRouter.get('/Users', authenticationController.getUsers)
authenticationRouter.post('/SignOn', authenticationValidationChains.singOn, authenticationController.signOn)
authenticationRouter.post('/LogIn', authenticationValidationChains.logIn, authenticationController.logIn)

export default authenticationRouter;