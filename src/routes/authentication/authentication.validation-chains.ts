import ev from "express-validator";
import { getfieldName } from "../../utils/getFieldName.js";
import { UserModel } from "../../models/schemas/user.schema.js";
import { ErrorExt } from "../../models/extensions/error.extension.js";
import { SignOn } from "../../models/dto/authentication.dto.js";

export const singOn = [
  ev.body(getfieldName<SignOn>("username"))
    .custom(async searchedUsername => {
      const match = await UserModel.findOne({ username: searchedUsername });
      if (match)
        throw new ErrorExt("USERNAME_TAKEN", 409, null);
      else
        return true
    }),
  ev.body(getfieldName<SignOn>("password"))
    .isLength({ min: 8 }).withMessage("SHORT_PASSWORD"),
  ev.body(getfieldName<SignOn>("passwordCopy"))
    .custom((passwordCopy, { req }) => {
      if (passwordCopy !== req.body.password)
        throw new ErrorExt("PASSWORDS_NOT_EQUAL", 400, null);
      else
        return true
    })
]

export const logIn = [
  ev.body(getfieldName<SignOn>("username")),
  ev.body(getfieldName<SignOn>("password"))
]