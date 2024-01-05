import ev from "express-validator";
import { getfieldName } from "../utils/getFieldName.js";
import { UserModel } from "../models/schemas/user.schema.js";
import { ErrorExt } from "../models/extensions/error.extension.js";
import { SignOn } from "../models/dto/authentication.dto.js";

export const singOn = [
  ev.body(getfieldName<SignOn>("username"))
    .exists()
    .withMessage({ message: "MISSING_USERNAME", errorCode: 400 })
    .custom(async searchedUsername => {
      const match = await UserModel.findOne({ username: searchedUsername });
      if (match)
        throw new Error();
      else
        return true
    })
    .withMessage({ message: "USERNAME_TAKEN", errorCode: 409 }),

  ev.body(getfieldName<SignOn>("password"))
    .exists()
    .withMessage({ message: "MISSING_PASSWORD", errorCode: 400 })
    .isLength({ min: 8 })
    .withMessage({ message: "SHORT_PASSWORD", errorCode: 422 }),

  ev.body(getfieldName<SignOn>("passwordCopy"))
    .exists()
    .withMessage({ message: "MISSING_PASSWORD_COPY", errorCode: 400 })
    .custom((passwordCopy, { req }) => {
      if (passwordCopy !== req.body.password)
        throw new Error();
      else
        return true
    })
    .withMessage({ message: "PASSWORDS_NOT_EQUAL", errorCode: 400 }),

]

export const logIn = [
  ev.body(getfieldName<SignOn>("username")).exists(),
  ev.body(getfieldName<SignOn>("password")).exists()
]