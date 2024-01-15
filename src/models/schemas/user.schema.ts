import mongoose from "mongoose";

//let's avoid magic strings for future ref ids.
export const userSchemaName = 'Users';

const userSchema = new mongoose.Schema({
  _id: ({
    type: mongoose.Types.ObjectId,
    required: true
  }),
  username: ({
    type: String,
    required: true
  }),
  password: ({
    type: String,
    required: true
  })
})

export const UserModel = mongoose.model(userSchemaName, userSchema);