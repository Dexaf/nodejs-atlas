import ev from "express-validator";
import { getfieldName } from "../utils/getFieldName.js";
import { UserModel } from "../models/schemas/user.schema.js";
import { SignOnDtoReq } from "../models/dto/req/authentication.dto.req.js";

export const singOn = [
  ev.body(getfieldName<SignOnDtoReq>("username"))
    .exists()
    .withMessage({ message: "MISSING_USERNAME", errorCode: 400 })
    .custom(async (searchedUsername: string) => {
      const match = await UserModel.findOne({ username: searchedUsername });
      if (match !== null)
        throw new Error('Username already exists');
      else
        return true;
    })
    .withMessage({ message: "USERNAME_TAKEN", errorCode: 409 }),

  ev.body(getfieldName<SignOnDtoReq>("password"))
    .exists()
    .withMessage({ message: "MISSING_PASSWORD", errorCode: 400 })
    .isLength({ min: 8 })
    .withMessage({ message: "SHORT_PASSWORD", errorCode: 422 }),

  ev.body(getfieldName<SignOnDtoReq>("passwordCopy"))
    .exists()
    .withMessage({ message: "MISSING_PASSWORD_COPY", errorCode: 400 })
    .custom((passwordCopy: string, { req  }) => {
      const body = req.body as SignOnDtoReq;
      return passwordCopy === body.password;
    })
    .withMessage({ message: "PASSWORDS_NOT_EQUAL", errorCode: 400 }),

]

export const logIn = [
  ev.body(getfieldName<SignOnDtoReq>("username")).exists().withMessage({ message: "MISSING_USERNAME", errorCode: 400 }),
  ev.body(getfieldName<SignOnDtoReq>("password")).exists().withMessage({ message: "MISSING_PASSWORD", errorCode: 400 })
]